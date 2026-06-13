import importlib
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/api/dashboard/job_progress")
async def api_dashboard_job_progress(limit: int = 10):
    try:
        from skills import _300_dashboard_pipeline as dashboard_pipeline
    except ImportError:
        dashboard_pipeline = importlib.import_module("skills.300_dashboard_pipeline")
        
    res = dashboard_pipeline.get_active_jobs_progress(limit)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res
