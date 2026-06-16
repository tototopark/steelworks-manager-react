from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core import db_client

router = APIRouter()

class NoteRequest(BaseModel):
    date: str
    note: str
    note2: Optional[str] = ""

class PlanRequest(BaseModel):
    date: str
    employee_id: int
    job_number: int
    lot: int
    priority: int

class TaskCreate(BaseModel):
    employee_id: int
    site: str
    task_instruction: str

class TaskUpdate(BaseModel):
    employee_id: int
    site: str
    task_instruction: str

@router.get("/api/tasks/active")
async def get_active_tasks_api(date: Optional[str] = None):
    try:
        from skills import _020_task_pipeline as task_pipeline
    except ImportError:
        import importlib
        task_pipeline = importlib.import_module("skills.020_task_pipeline")
        
    try:
        if date:
            tasks = task_pipeline.get_tasks_by_date(date)
        else:
            tasks = task_pipeline.get_active_tasks()
        return {"status": "success", "data": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/tasks/active-date")
async def get_active_tasks_date_api():
    try:
        res = db_client.fetch_one("SELECT expiry_date FROM tb_tasks WHERE expiry_date IS NOT NULL ORDER BY expiry_date DESC LIMIT 1")
        return {"status": "success", "date": res["expiry_date"] if res else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/tasks")
async def create_task_api(payload: TaskCreate):
    try:
        from skills import _020_task_pipeline as task_pipeline
    except ImportError:
        import importlib
        task_pipeline = importlib.import_module("skills.020_task_pipeline")
        
    try:
        task_pipeline.create_task(payload.site, payload.task_instruction, employee_id=payload.employee_id)
        return {"status": "success", "message": "Task created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/tasks/{task_id}")
async def update_task_api(task_id: int, payload: TaskUpdate):
    try:
        db_client.execute_query(
            "UPDATE tb_tasks SET employee = ?, site = ?, task = ? WHERE id = ?",
            (payload.employee_id, payload.site, payload.task_instruction, task_id)
        )
        return {"status": "success", "message": "Task updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/tasks/{task_id}")
async def delete_task_api(task_id: int):
    try:
        db_client.execute_query("DELETE FROM tb_tasks WHERE id = ?", (task_id,))
        return {"status": "success", "message": "Task deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/dev/random-date")
async def get_random_data_date(type: str):
    try:
        if type == "weekly":
            query = "SELECT date FROM tb_week_notes WHERE date IS NOT NULL AND note != '' ORDER BY RANDOM() LIMIT 1"
            res = db_client.fetch_one(query)
            if not res:
                query = """
                    SELECT p.date 
                    FROM tb_production_plan p
                    JOIN tb_login e ON p.employee_id = e.id
                    WHERE p.date IS NOT NULL AND e.is_active = 1 AND e.admin_validation = 1
                    ORDER BY RANDOM() LIMIT 1
                """
                res = db_client.fetch_one(query)
            return {"status": "success", "date": res["date"] if res else None}
        elif type == "whiteboard":
            query = """
                SELECT t.expiry_date as date 
                FROM tb_tasks t 
                JOIN tb_login e ON t.employee = e.id 
                WHERE t.expiry_date IS NOT NULL 
                  AND e.is_active = 1 AND e.admin_validation = 1 
                  AND e.right_level IN (1, 2, 12)
                ORDER BY RANDOM() LIMIT 1
            """
            res = db_client.fetch_one(query)
            if not res:
                query = "SELECT expiry_date as date FROM tb_tasks WHERE expiry_date IS NOT NULL ORDER BY RANDOM() LIMIT 1"
                res = db_client.fetch_one(query)
            return {"status": "success", "date": res["date"] if res else None}
        return {"status": "error", "message": "Invalid type"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/schedule/weekly")
async def api_get_schedule_weekly(start_date: str, end_date: str):
    try:
        from skills import _310_schedule_pipeline as schedule_pipeline
    except ImportError:
        import importlib
        schedule_pipeline = importlib.import_module("skills.310_schedule_pipeline")
    
    res = schedule_pipeline.get_weekly_schedule(start_date, end_date)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/schedule/notes")
async def api_post_schedule_notes(data: NoteRequest):
    try:
        from skills import _310_schedule_pipeline as schedule_pipeline
    except ImportError:
        import importlib
        schedule_pipeline = importlib.import_module("skills.310_schedule_pipeline")
        
    res = schedule_pipeline.update_daily_note(data.date, data.note, data.note2)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/schedule/plan")
async def api_post_schedule_plan(data: PlanRequest):
    try:
        from skills import _310_schedule_pipeline as schedule_pipeline
    except ImportError:
        import importlib
        schedule_pipeline = importlib.import_module("skills.310_schedule_pipeline")
        
    res = schedule_pipeline.assign_production_plan(data.date, data.employee_id, data.job_number, data.lot, data.priority)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.get("/api/schedule/job-options")
async def api_get_schedule_job_options():
    try:
        from skills import _310_schedule_pipeline as schedule_pipeline
    except ImportError:
        import importlib
        schedule_pipeline = importlib.import_module("skills.310_schedule_pipeline")
    return schedule_pipeline.get_job_options()
