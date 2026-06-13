from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core import db_client

router = APIRouter()

class HolidayRequest(BaseModel):
    name: str
    date_start: str
    date_stop: str

@router.get("/api/holidays")
async def api_get_holidays():
    try:
        holidays = db_client.fetch_all("SELECT * FROM tb_public_holidays ORDER BY date_start ASC")
        return {"status": "success", "data": holidays}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/holidays")
async def api_create_holiday(data: HolidayRequest):
    try:
        query = "INSERT INTO tb_public_holidays (name, date_start, date_stop) VALUES (?, ?, ?)"
        db_client.execute_query(query, (data.name, data.date_start, data.date_stop))
        return {"status": "success", "message": "Holiday added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/holidays/{holiday_id}")
async def api_delete_holiday(holiday_id: int):
    try:
        query = "DELETE FROM tb_public_holidays WHERE id = ?"
        db_client.execute_query(query, (holiday_id,))
        return {"status": "success", "message": "Holiday deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
