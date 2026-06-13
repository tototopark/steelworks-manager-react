from fastapi import APIRouter, HTTPException
from core import db_client

router = APIRouter()

@router.get("/api/activity")
async def api_get_activity(limit: int = 100):
    try:
        query = """
            SELECT p.*, e.firstname, e.surname, e.role,
                   jd.member, jd.job_number as job_no
            FROM tb_punchsheet p
            JOIN tb_login e ON p.employee_id = e.id
            LEFT JOIN tb_jobs_details jd ON p.job_detail_id = jd.id
            ORDER BY p.id DESC LIMIT ?
        """
        logs = db_client.fetch_all(query, (limit,))
        return {"status": "success", "data": logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
