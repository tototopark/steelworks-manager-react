import os
import shutil
import uuid
from datetime import date
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from core import db_client

router = APIRouter()

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class JobCreate(BaseModel):
    job_number: int
    company_name: str
    site_address: str
    superlot: Optional[str] = ""
    lot_group: Optional[str] = ""
    supervisor_name: Optional[str] = ""
    builder_name: Optional[str] = ""
    installer_name: Optional[str] = ""

class JobIngestRequest(BaseModel):
    job_number: int
    company_name: str
    site_address: str
    supervisor_name: Optional[str] = ""
    raw_excel_data: str

class JobUpdate(BaseModel):
    company_name: str
    site_address: Optional[str] = None

class DetailStatusUpdate(BaseModel):
    field: str
    value: int

class BulkLotStatusUpdate(BaseModel):
    field: str
    value: int

class InstallDateUpdate(BaseModel):
    date_install: Optional[str] = None
    status_install: str

ALLOWED_STATUS_FIELDS = {
    "design", "made", "loaded", "on_site",
    "temp_fix", "chemset", "tightened", "finish"
}

FIELD_DATE_MAP = {
    "design": "design_date_update",
    "made": "made_date_update",
    "loaded": "load_date_update",
    "on_site": "on_site_date_update",
    "temp_fix": "temp_fix_date_update",
    "chemset": "chemset_date_update",
    "tightened": "tightened_date_update",
    "finish": "finish_date_update",
}

@router.get("/api/jobs")
async def get_jobs(status: str = "active", limit: int = 50, offset: int = 0):
    try:
        if status == "completed":
            query = """
                SELECT j.job_number, j.company_name, j.site_address, j.date_creation 
                FROM tb_jobs j
                WHERE EXISTS (SELECT 1 FROM tb_jobs_details d WHERE d.job_number = j.job_number)
                  AND NOT EXISTS (SELECT 1 FROM tb_jobs_details d WHERE d.job_number = j.job_number AND (d.finish IS NULL OR d.finish = 0))
                ORDER BY j.date_creation DESC
                LIMIT ? OFFSET ?
            """
        elif status == "active":
            query = """
                SELECT j.job_number, j.company_name, j.site_address, j.date_creation 
                FROM tb_jobs j
                WHERE NOT EXISTS (SELECT 1 FROM tb_jobs_details d WHERE d.job_number = j.job_number)
                   OR EXISTS (SELECT 1 FROM tb_jobs_details d WHERE d.job_number = j.job_number AND (d.finish IS NULL OR d.finish = 0))
                ORDER BY j.date_creation DESC
                LIMIT ? OFFSET ?
            """
        else: # "all"
            query = """
                SELECT job_number, company_name, site_address, date_creation 
                FROM tb_jobs 
                ORDER BY date_creation DESC 
                LIMIT ? OFFSET ?
            """
            
        rows = db_client.fetch_all(query, (limit, offset))
        return {"status": "success", "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/jobs")
async def create_job(payload: JobCreate):
    try:
        exists = db_client.fetch_one("SELECT id FROM tb_jobs WHERE job_number = ?", (payload.job_number,))
        if exists:
            raise HTTPException(status_code=400, detail=f"Job number {payload.job_number} already exists.")
            
        db_client.execute_query(
            """
            INSERT INTO tb_jobs (
                date_creation, job_number, company_name, site_address, superlot,
                lot_group, supervisor_name, builder_name, installer_name, date_last_update
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                date.today().isoformat(), payload.job_number, payload.company_name, 
                payload.site_address, payload.superlot, payload.lot_group, 
                payload.supervisor_name, payload.builder_name, payload.installer_name, 
                date.today().isoformat()
            )
        )
        return {"status": "success", "message": f"Job {payload.job_number} created successfully."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/jobs/{job_number}")
async def update_job(job_number: int, payload: JobUpdate):
    try:
        db_client.execute_query(
            "UPDATE tb_jobs SET company_name = ?, site_address = ? WHERE job_number = ?",
            (payload.company_name, payload.site_address, job_number)
        )
        return {"status": "success", "message": "Job updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/jobs/{job_number}")
async def delete_job(job_number: int):
    try:
        db_client.execute_query("DELETE FROM tb_wip WHERE job_number = ?", (job_number,))
        db_client.execute_query("DELETE FROM tb_punchsheet WHERE job_number = ?", (job_number,))
        db_client.execute_query("DELETE FROM tb_job_dates WHERE job_number = ?", (job_number,))
        db_client.execute_query("DELETE FROM tb_job_members WHERE job_number = ?", (job_number,))
        db_client.execute_query("DELETE FROM tb_job_lots WHERE job_number = ?", (job_number,))
        db_client.execute_query("DELETE FROM tb_jobs WHERE job_number = ?", (job_number,))
        return {"status": "success", "message": "Job and all related data deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/jobs/{job_number}/details")
async def api_get_job_details(job_number: int):
    try:
        from skills import _010_job_pipeline as job_pipeline
    except ImportError:
        import importlib
        job_pipeline = importlib.import_module("skills.010_job_pipeline")
        
    details = job_pipeline.get_job_details(job_number)
    return {"status": "success", "data": details}

@router.post("/api/jobs/ingest")
async def api_jobs_ingest(payload: JobIngestRequest):
    try:
        from skills import _010_job_pipeline as job_pipeline
    except ImportError:
        import importlib
        job_pipeline = importlib.import_module("skills.010_job_pipeline")
        
    try:
        job_pipeline.create_job(payload.job_number, payload.company_name, payload.site_address)
        
        lines = payload.raw_excel_data.strip().split('\n')
        ingested_count = 0
        for line in lines:
            line = line.strip()
            if not line:
                continue
            cols = line.split('\t')
            if len(cols) >= 3:
                page = cols[0].strip()
                lot = cols[1].strip()
                member = cols[2].strip()
                
                page_val = int(page) if page.isdigit() else 1
                lot_val = int(lot) if lot.isdigit() else 1
                
                job_pipeline.add_job_detail_member(payload.job_number, page_val, lot_val, member)
                ingested_count += 1
                
        return {"status": "success", "message": f"Job {payload.job_number} created with {ingested_count} members ingested."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.patch("/api/jobs/{job_number}/details/{detail_id}/status")
async def update_detail_status(job_number: int, detail_id: int, payload: DetailStatusUpdate):
    if payload.field not in ALLOWED_STATUS_FIELDS:
        raise HTTPException(status_code=400, detail=f"Invalid field: {payload.field}")
    if payload.value not in (0, 1):
        raise HTTPException(status_code=400, detail="Value must be 0 or 1")

    row = db_client.fetch_one(
        "SELECT id FROM tb_jobs_details WHERE id = ? AND job_number = ?",
        (detail_id, job_number)
    )
    if not row:
        raise HTTPException(status_code=404, detail="Job detail not found")

    todays_date = date.today().isoformat()
    date_col = FIELD_DATE_MAP[payload.field]

    if payload.value == 1:
        db_client.execute_query(
            f"UPDATE tb_jobs_details SET {payload.field} = 1, {date_col} = ? WHERE id = ?",
            (todays_date, detail_id)
        )
    else:
        db_client.execute_query(
            f"UPDATE tb_jobs_details SET {payload.field} = 0, {date_col} = NULL WHERE id = ?",
            (detail_id,)
        )

    return {"status": "success", "message": f"Field '{payload.field}' updated to {payload.value}"}

@router.patch("/api/jobs/{job_number}/lots/{lot_number}/bulk-status")
async def bulk_update_lot_status(job_number: int, lot_number: int, payload: BulkLotStatusUpdate):
    if payload.field not in ALLOWED_STATUS_FIELDS:
        raise HTTPException(status_code=400, detail=f"Invalid field: {payload.field}")
    if payload.value not in (0, 1):
        raise HTTPException(status_code=400, detail="Value must be 0 or 1")

    todays_date = date.today().isoformat()
    date_col = FIELD_DATE_MAP[payload.field]

    if payload.value == 1:
        db_client.execute_query(
            f"UPDATE tb_jobs_details SET {payload.field} = 1, {date_col} = ? WHERE job_number = ? AND lot = ?",
            (todays_date, job_number, lot_number)
        )
    else:
        db_client.execute_query(
            f"UPDATE tb_jobs_details SET {payload.field} = 0, {date_col} = NULL WHERE job_number = ? AND lot = ?",
            (job_number, lot_number)
        )

    count_row = db_client.fetch_one(
        "SELECT COUNT(*) as cnt FROM tb_jobs_details WHERE job_number = ? AND lot = ?",
        (job_number, lot_number)
    )
    updated_count = count_row["cnt"] if count_row else 0
    return {"status": "success", "message": f"{updated_count} members in Lot {lot_number} updated: {payload.field} = {payload.value}"}

@router.get("/api/jobs/{job_number}/install-dates")
async def get_job_install_dates(job_number: int):
    try:
        rows = db_client.fetch_all(
            "SELECT id, date_creation, job_number, lot, date_install, status_install FROM tb_jobs_date_install WHERE job_number = ? ORDER BY lot",
            (job_number,)
        )
        return {"status": "success", "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/jobs/{job_number}/install-dates/{lot}")
async def update_job_install_date(job_number: int, lot: int, payload: InstallDateUpdate):
    try:
        existing = db_client.fetch_one(
            "SELECT id FROM tb_jobs_date_install WHERE job_number = ? AND lot = ?",
            (job_number, lot)
        )
        
        if existing:
            db_client.execute_query(
                "UPDATE tb_jobs_date_install SET date_install = ?, status_install = ? WHERE job_number = ? AND lot = ?",
                (payload.date_install, payload.status_install, job_number, lot)
            )
        else:
            todays_date = date.today().isoformat()
            db_client.execute_query(
                "INSERT INTO tb_jobs_date_install (date_creation, job_number, lot, date_install, status_install) VALUES (?, ?, ?, ?, ?)",
                (todays_date, job_number, lot, payload.date_install, payload.status_install)
            )
        return {"status": "success", "message": f"Install date/status for Job {job_number} Lot {lot} updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/jobs/{job_number}/install-dates/{lot}")
async def delete_job_install_date(job_number: int, lot: int):
    try:
        db_client.execute_query(
            "DELETE FROM tb_jobs_date_install WHERE job_number = ? AND lot = ?",
            (job_number, lot)
        )
        return {"status": "success", "message": f"Install date for Job {job_number} Lot {lot} deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/jobs/{job_number}/photos")
async def get_job_photos(job_number: int):
    try:
        photos = db_client.fetch_all("SELECT * FROM tb_photos WHERE job_number = ? ORDER BY id DESC", (job_number,))
        return {"status": "success", "data": photos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/jobs/{job_number}/photos")
async def upload_job_photo(job_number: int, file: UploadFile = File(...)):
    try:
        job = db_client.fetch_one("SELECT job_number, date_creation FROM tb_jobs WHERE job_number = ?", (job_number,))
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".dwg", ".dxf"]
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {ext}. Allowed: {', '.join(allowed)}")

        year = "2026"
        if job.get("date_creation"):
            try:
                year = job["date_creation"].split("-")[0]
            except Exception:
                pass

        upload_dir = os.path.join(project_root, "static", "uploads", "jobs", year)
        os.makedirs(upload_dir, exist_ok=True)
        
        filename = f"{job_number}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb") as buf:
            shutil.copyfileobj(file.file, buf)

        photo_url = f"/uploads/jobs/{year}/{filename}"
        db_client.execute_query(
            "INSERT INTO tb_photos (job_number, year_creation, photo_name) VALUES (?, ?, ?)",
            (job_number, year, photo_url)
        )

        return {"status": "success", "message": "Photo uploaded.", "photo_name": photo_url}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
