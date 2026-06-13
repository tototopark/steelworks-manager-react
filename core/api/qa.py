from datetime import date
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core import db_client

router = APIRouter()

class QAInspectRequest(BaseModel):
    wip_id: int
    is_pass: bool
    comment: Optional[str] = ""

class WIPAction(BaseModel):
    job_number: int
    wps: str
    inspector: str
    inspector_type: str
    pass_fail: int
    comment: Optional[str] = ""

@router.get("/api/qa/jobs")
async def api_get_qa_jobs():
    try:
        from skills import _015_qa_pipeline as qa_pipeline
    except ImportError:
        import importlib
        qa_pipeline = importlib.import_module("skills.015_qa_pipeline")
        
    res = qa_pipeline.get_pending_qa_jobs()
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.get("/api/qa/wip/{job_number}")
async def api_get_qa_wip(job_number: int):
    try:
        from skills import _015_qa_pipeline as qa_pipeline
    except ImportError:
        import importlib
        qa_pipeline = importlib.import_module("skills.015_qa_pipeline")
        
    res = qa_pipeline.get_wip_list_by_job(job_number)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/qa/inspect")
async def api_post_qa_inspect(data: QAInspectRequest):
    try:
        from skills import _015_qa_pipeline as qa_pipeline
    except ImportError:
        import importlib
        qa_pipeline = importlib.import_module("skills.015_qa_pipeline")
        
    res = qa_pipeline.process_qa_inspection(data.wip_id, data.is_pass, data.comment)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.get("/api/qa/wip-complete/{job_number}")
async def api_get_wip_complete_status(job_number: int):
    try:
        row = db_client.fetch_one(
            "SELECT job_number, WIP_Completed, WIP_Completed_Date FROM tb_jobs WHERE job_number = ?",
            (job_number,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Job not found")
        return {
            "status": "success",
            "job_number": job_number,
            "wip_completed": row["WIP_Completed"],
            "wip_completed_date": row["WIP_Completed_Date"]
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/qa/wip-complete/{job_number}/toggle")
async def api_toggle_wip_complete(job_number: int):
    try:
        row = db_client.fetch_one(
            "SELECT WIP_Completed FROM tb_jobs WHERE job_number = ?",
            (job_number,)
        )
        if not row:
            raise HTTPException(status_code=404, detail="Job not found")

        current = row["WIP_Completed"]
        if not current or current == 0:
            today = date.today().isoformat()
            db_client.execute_query(
                "UPDATE tb_jobs SET WIP_Completed = 1, WIP_Completed_Date = ? WHERE job_number = ?",
                (today, job_number)
            )
            return {"status": "success", "new_state": 1, "wip_completed_date": today, "message": "WIP inspection marked as complete"}
        else:
            db_client.execute_query(
                "UPDATE tb_jobs SET WIP_Completed = 0, WIP_Completed_Date = NULL WHERE job_number = ?",
                (job_number,)
            )
            return {"status": "success", "new_state": 0, "wip_completed_date": None, "message": "WIP inspection status reset"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/wip")
async def process_wip(payload: WIPAction):
    try:
        from skills import _140_wip_pipeline as wip_pipeline
    except ImportError:
        import importlib
        wip_pipeline = importlib.import_module("skills.140_wip_pipeline")
        
    try:
        wip_pipeline.record_wip(
            payload.job_number, payload.wps, payload.inspector, 
            payload.inspector_type, payload.pass_fail, payload.comment
        )
        return {"status": "success", "message": "WIP record saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/dev/qa-test-data")
async def generate_qa_test_data():
    try:
        db_client.execute_query("""
            UPDATE tb_wip 
            SET inspection_pass_fail = 0 
            WHERE id IN (SELECT id FROM tb_wip ORDER BY RANDOM() LIMIT 5)
        """)
        return {"status": "success", "message": "Test data generated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
