from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from core import db_client
from core.api.auth import get_current_user_payload

router = APIRouter()

@router.get("/api/performance/stats")
async def get_performance_stats(
    week: Optional[int] = None,
    year: Optional[int] = None,
    payload: dict = Depends(get_current_user_payload)
):
    try:
        role_level = int(payload.get("right_level", 1))
        if role_level < 5:  # Accountant, Admin, MD만 가능
            raise HTTPException(status_code=403, detail="Forbidden")

        if year is None:
            year = datetime.now().year
        if week is None:
            week = datetime.now().isocalendar()[1]

        employees = db_client.fetch_all(
            "SELECT id, login, firstname, surname FROM tb_login WHERE right_level = 1 AND admin_validation = 1"
        )

        results = []
        for emp in employees:
            emp_id = emp["id"]
            
            punch_rows = db_client.fetch_all(
                """
                SELECT job_detail_id, start_time, stop_time 
                FROM tb_punchsheet 
                WHERE employee_id = ? AND year = ? AND week = ? AND startstop = 'STOP' AND job_detail_id NOT IN ('CLOCK IN', 'CLOCK OUT')
                """,
                (emp_id, year, week)
            )

            portal_count = 0
            beam_count = 0
            column_count = 0
            other_count = 0

            for p in punch_rows:
                job_detail_id = p["job_detail_id"]
                jd = db_client.fetch_one("SELECT member FROM tb_jobs_details WHERE id = ?", (job_detail_id,))
                if jd and jd["member"]:
                    member_name = jd["member"].lower()
                    if member_name.startswith("p"):
                        portal_count += 1
                    elif member_name.startswith("b") and not member_name.startswith("br"):
                        beam_count += 1
                    elif member_name.startswith("c"):
                        column_count += 1
                    else:
                        other_count += 1
                else:
                    other_count += 1

            total_hours = 0.0
            all_punches = db_client.fetch_all(
                """
                SELECT id, startstop, start_time, stop_time, day, month, year 
                FROM tb_punchsheet 
                WHERE employee_id = ? AND year = ? AND week = ? AND job_detail_id NOT IN ('CLOCK IN', 'CLOCK OUT')
                ORDER BY id ASC
                """,
                (emp_id, year, week)
            )

            start_temp = None
            for row in all_punches:
                if row["startstop"] == "START":
                    try:
                        if row["start_time"]:
                            start_temp = datetime.strptime(row["start_time"], "%H:%M")
                    except Exception:
                        start_temp = None
                elif row["startstop"] == "STOP" and start_temp is not None:
                    try:
                        if row["stop_time"]:
                            stop_temp = datetime.strptime(row["stop_time"], "%H:%M")
                            diff = (stop_temp - start_temp).total_seconds() / 3600.0
                            if diff > 0:
                                total_hours += diff
                    except Exception:
                        pass
                    start_temp = None

            total_hours = round(total_hours, 2)
            results.append({
                "employee_id": emp_id,
                "login": emp["login"],
                "name": f"{emp['firstname']} {emp['surname']}".strip() or emp["login"],
                "portals": portal_count,
                "beams": beam_count,
                "columns": column_count,
                "others": other_count,
                "total_hours": total_hours,
                "total_qty": portal_count + beam_count + column_count + other_count
            })

        return {"status": "success", "year": year, "week": week, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
