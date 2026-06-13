import io
import csv
from datetime import datetime, date
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from core import db_client
from core.api.auth import get_current_user_payload

router = APIRouter()

class PunchAction(BaseModel):
    employee_id: int
    action: str  # "in" or "out"
    job_detail_id: Optional[str] = None

@router.post("/api/punch")
async def process_punch(payload: PunchAction):
    try:
        from skills import _030_punch_pipeline as punch_pipeline
    except ImportError:
        import importlib
        punch_pipeline = importlib.import_module("skills.030_punch_pipeline")
        
    try:
        if payload.job_detail_id and payload.job_detail_id not in ["CLOCK IN", "CLOCK OUT"]:
            if payload.action == "in":
                punch_pipeline.start_task_work(payload.employee_id, payload.job_detail_id)
            elif payload.action == "out":
                punch_pipeline.stop_task_work(payload.employee_id, payload.job_detail_id)
                
                emp = db_client.fetch_one("SELECT login FROM tb_login WHERE id = ?", (payload.employee_id,))
                emp_login = emp["login"] if emp else "system"
                
                member_row = db_client.fetch_one("SELECT member, job_number, lot FROM tb_jobs_details WHERE id = ?", (payload.job_detail_id,))
                if member_row:
                    todays_date = datetime.now().date().isoformat()
                    member_name = member_row["member"]
                    job_number = member_row["job_number"]
                    lot = member_row["lot"]
                    
                    if member_name.lower().startswith("task"):
                        db_client.execute_query(
                            "UPDATE tb_jobs_details SET finish=1, finish_date_update=?, finish_by=? WHERE id=?",
                            (todays_date, emp_login, payload.job_detail_id)
                        )
                    else:
                        db_client.execute_query(
                            "UPDATE tb_jobs_details SET made=1, made_date_update=?, made_by=? WHERE id=?",
                            (todays_date, emp_login, payload.job_detail_id)
                        )
                        
                    total = db_client.fetch_one(
                        "SELECT COUNT(*) as nbtotal FROM tb_jobs_details WHERE job_number=? AND lot=?",
                        (job_number, lot)
                    )
                    made = db_client.fetch_one(
                        "SELECT COUNT(*) as nbtotalmade FROM tb_jobs_details WHERE job_number=? AND lot=? AND made=1",
                        (job_number, lot)
                    )
                    
                    if total and made and total["nbtotal"] >= 1 and total["nbtotal"] == made["nbtotalmade"]:
                        db_client.execute_query(
                            "UPDATE tb_jobs_date_install SET status_install='ready' WHERE job_number=? AND lot=?",
                            (job_number, lot)
                        )
            else:
                raise HTTPException(status_code=400, detail="Invalid action")
        else:
            if payload.action == "in":
                punch_pipeline.clock_in(payload.employee_id)
            elif payload.action == "out":
                punch_pipeline.clock_out(payload.employee_id)
            else:
                raise HTTPException(status_code=400, detail="Invalid action")
                
        return {"status": "success", "message": f"Successfully processed punch {payload.action}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/punch/latest_week")
async def get_latest_punch_week(payload: dict = Depends(get_current_user_payload)):
    try:
        try:
            role_level = int(payload.get("right_level", 1))
        except Exception:
            role_level = 1
            
        login_id = payload.get("sub")
        user_row = db_client.fetch_one("SELECT id FROM tb_login WHERE login = ?", (login_id,))
        logged_in_uid = user_row["id"] if user_row else None
        
        query = "SELECT year, week FROM tb_punchsheet"
        params = []
        
        if role_level < 99:
            query += " WHERE employee_id = ?"
            params.append(logged_in_uid if logged_in_uid is not None else -1)
            
        query += " ORDER BY id DESC LIMIT 1"
        latest = db_client.fetch_one(query, tuple(params))
        if latest:
            return {"status": "success", "year": latest["year"], "week": latest["week"]}
        return {"status": "success", "year": None, "week": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/punch/timesheet")
async def get_timesheet(
    employee_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    year: Optional[int] = None,
    week: Optional[int] = None,
    payload: dict = Depends(get_current_user_payload)
):
    try:
        try:
            role_level = int(payload.get("right_level", 1))
        except Exception:
            role_level = 1
            
        login_id = payload.get("sub")
        user_row = db_client.fetch_one("SELECT id FROM tb_login WHERE login = ?", (login_id,))
        logged_in_uid = user_row["id"] if user_row else None
        
        if role_level < 99:
            query_emp_id = logged_in_uid if logged_in_uid is not None else -1
        else:
            query_emp_id = employee_id

        if not query_emp_id or query_emp_id == -1:
            return {"status": "success", "data": [], "year": year, "week": week}

        if year is None or week is None:
            latest = db_client.fetch_one("SELECT year, week FROM tb_punchsheet ORDER BY id DESC LIMIT 1")
            if latest:
                if year is None:
                    year = latest["year"]
                if week is None:
                    week = latest["week"]

        query = """
            SELECT p.*, e.firstname, e.surname, e.role 
            FROM tb_punchsheet p
            JOIN tb_login e ON p.employee_id = e.id
            WHERE 1=1
        """
        params = []
        
        if query_emp_id:
            query += " AND p.employee_id = ?"
            params.append(query_emp_id)

        if year is not None:
            query += " AND p.year = ?"
            params.append(year)

        if week is not None:
            query += " AND p.week = ?"
            params.append(week)

        rows = db_client.fetch_all(query, tuple(params))
        
        filtered_rows = []
        m_map_str = {'Jan':'01','Feb':'02','Mar':'03','Apr':'04','May':'05','Jun':'06','Jul':'07','Aug':'08','Sep':'09','Oct':'10','Nov':'11','Dec':'12'}
        m_map_int = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
        WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        
        for r in rows:
            m_str = m_map_str.get(r["month"], "01")
            d_str = str(r["day"]).zfill(2)
            r_date_str = f"{r['year']}-{m_str}-{d_str}"
            
            if start_date and r_date_str < start_date:
                continue
            if end_date and r_date_str > end_date:
                continue
                
            r["formatted_date"] = r_date_str
            
            try:
                y = int(r["year"])
                m = m_map_int.get(r["month"], 1)
                d = int(r["day"])
                w_idx = date(y, m, d).weekday()
                r["day_of_week"] = WEEKDAYS_EN[w_idx]
            except Exception as ex:
                print(f"Error parsing date for weekday: {ex}, Row: {r}")
                r["day_of_week"] = ""
                
            filtered_rows.append(r)
            
        def get_weekday_index(x):
            try:
                y = int(x["year"])
                m = m_map_int.get(x["month"], 1)
                d = int(x["day"])
                return date(y, m, d).weekday()
            except Exception:
                return 9
                
        filtered_rows.sort(key=lambda x: (-get_weekday_index(x), -x["id"]))
        return {"status": "success", "data": filtered_rows, "year": year, "week": week}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/export/punch")
async def export_punch_csv(
    employee_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    payload: dict = Depends(get_current_user_payload)
):
    try:
        role_level = payload.get("right_level", 1)
        login_id = payload.get("sub")
        
        user_row = db_client.fetch_one("SELECT id FROM tb_login WHERE login = ?", (login_id,))
        logged_in_uid = user_row["id"] if user_row else None
        
        if role_level < 10:
            query_emp_id = logged_in_uid
        else:
            query_emp_id = employee_id

        query = """
            SELECT p.id, p.year, p.month, p.day, p.week, p.employee_id, e.firstname, e.surname, 
                   p.job_detail_id, p.startstop, p.start_time, p.start_time_AMPM, p.stop_time, p.stop_time_AMPM
            FROM tb_punchsheet p
            JOIN tb_login e ON p.employee_id = e.id
            WHERE 1=1
        """
        params = []
        if query_emp_id:
            query += " AND p.employee_id = ?"
            params.append(query_emp_id)

        rows = db_client.fetch_all(query, tuple(params))
        
        filtered_rows = []
        m_map = {'Jan':'01','Feb':'02','Mar':'03','Apr':'04','May':'05','Jun':'06','Jul':'07','Aug':'08','Sep':'09','Oct':'10','Nov':'11','Dec':'12'}
        for r in rows:
            m_str = m_map.get(r["month"], "01")
            d_str = str(r["day"]).zfill(2)
            r_date_str = f"{r['year']}-{m_str}-{d_str}"
            if start_date and r_date_str < start_date:
                continue
            if end_date and r_date_str > end_date:
                continue
            r["date"] = r_date_str
            filtered_rows.append(r)
            
        filtered_rows.sort(key=lambda x: x["id"], reverse=True)

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Date", "Week", "Employee ID", "Firstname", "Surname", "Job Detail ID", "Action", "Start Time", "Stop Time"])
        
        for r in filtered_rows:
            writer.writerow([
                r["id"], r["date"], r["week"], r["employee_id"], r["firstname"], r["surname"],
                r["job_detail_id"], r["startstop"], r["start_time"] or "", r["stop_time"] or ""
            ])
            
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8-sig')), 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=punchsheet_report.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
