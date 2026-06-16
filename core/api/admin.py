import importlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class IntegrityCheckRequest(BaseModel):
    fix: bool = False

@router.post("/api/admin/migrate_legacy")
async def api_migrate_legacy():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)
        
    res = admin_pipeline.migrate_legacy_data()
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/admin/reset_passwords")
async def api_reset_passwords():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)
        
    res = admin_pipeline.reset_all_passwords()
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/admin/reset_passwords_hashed")
async def api_reset_passwords_hashed():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)
        
    res = admin_pipeline.reset_all_passwords_hashed()
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/admin/randomize_names")
async def api_randomize_names():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)

    res = admin_pipeline.randomize_names()
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.get("/api/admin/db_inspect/tables")
async def api_db_inspect_tables():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)
        
    return {"status": "success", "data": admin_pipeline.get_tables_list()}

@router.get("/api/admin/db_inspect/{table_name}")
async def api_db_inspect_table(table_name: str, limit: int = 10, offset: int = 0, sort_order: str = "desc"):
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)
        
    res = admin_pipeline.get_table_data(table_name, limit, offset, sort_order)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/admin/db_integrity")
async def api_db_integrity(payload: IntegrityCheckRequest):
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    importlib.reload(admin_pipeline)
        
    res = admin_pipeline.run_integrity_check(fix=payload.fix)
    if res["status"] == "error":
        raise HTTPException(status_code=500, detail=res["message"])
    return res

@router.post("/api/admin/db_reset")
async def admin_db_reset():
    try:
        import tests.db_init as db_init
        db_init.create_tables()
        return {"status": "success", "message": "Database reset successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/admin/db_seed")
async def admin_db_seed():
    try:
        db_seeder = importlib.import_module("skills.999_db_seeder")
        db_seeder.seed_database()
        return {"status": "success", "message": "Database seeded with mock data."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/admin/health")
async def api_admin_health():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
    except ImportError:
        admin_pipeline = importlib.import_module("skills.200_admin_pipeline")
    return admin_pipeline.get_system_health()

@router.post("/api/admin/clean-data")
async def api_admin_clean_data():
    try:
        from skills import _200_admin_pipeline as admin_pipeline
        res = admin_pipeline.factory_reset_database()
        if res["status"] == "error":
            raise HTTPException(status_code=500, detail=res["message"])
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
