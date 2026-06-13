from datetime import date, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core import db_client

router = APIRouter()

class VehicleCreate(BaseModel):
    vehicle: str
    plate: str
    wof: Optional[str] = None
    rego: Optional[str] = None
    service: Optional[int] = None
    ruc: Optional[int] = None
    current_odo: Optional[int] = None

class OtherReminderCreate(BaseModel):
    name: str
    comment: Optional[str] = None
    expiry_date: Optional[str] = None

class OtherReminderUpdate(BaseModel):
    name: str
    comment: Optional[str] = None
    expiry_date: Optional[str] = None

@router.get("/api/reminders/vehicles")
async def get_vehicles():
    try:
        vehicles = db_client.fetch_all("SELECT * FROM tb_reminder_vehicle ORDER BY id DESC")
        return {"status": "success", "data": vehicles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/reminders/vehicles")
async def create_vehicle(payload: VehicleCreate):
    try:
        db_client.execute_query(
            """
            INSERT INTO tb_reminder_vehicle (
                Vehicle, Plate, WOF, REGO, SERVICE, RUC, Current_ODO, VeederEroad
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)
            """,
            (payload.vehicle, payload.plate, payload.wof, payload.rego, payload.service, payload.ruc, payload.current_odo)
        )
        return {"status": "success", "message": f"Vehicle {payload.vehicle} registered."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/reminders/vehicles/{v_id}")
async def update_vehicle(v_id: int, payload: VehicleCreate):
    try:
        db_client.execute_query(
            """
            UPDATE tb_reminder_vehicle 
            SET Vehicle = ?, Plate = ?, WOF = ?, REGO = ?, SERVICE = ?, RUC = ?, Current_ODO = ?
            WHERE id = ?
            """,
            (payload.vehicle, payload.plate, payload.wof, payload.rego, payload.service, payload.ruc, payload.current_odo, v_id)
        )
        return {"status": "success", "message": "Vehicle updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/reminders/vehicles/{v_id}")
async def delete_vehicle(v_id: int):
    try:
        db_client.execute_query("DELETE FROM tb_reminder_vehicle WHERE id = ?", (v_id,))
        return {"status": "success", "message": "Vehicle deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/reminders/vehicles/expiry-check")
async def api_vehicle_expiry_check():
    try:
        today = date.today()
        warn_date = today + timedelta(days=30)
        today_str = today.isoformat()
        warn_str = warn_date.isoformat()

        vehicles = db_client.fetch_all("SELECT * FROM tb_reminder_vehicle")
        warnings = []
        for v in vehicles:
            alerts = []
            if v.get("WOF") and v["WOF"] <= warn_str:
                status = "expired" if v["WOF"] < today_str else "expiring"
                alerts.append({"type": "WOF", "date": v["WOF"], "status": status})
            if v.get("REGO") and v["REGO"] <= warn_str:
                status = "expired" if v["REGO"] < today_str else "expiring"
                alerts.append({"type": "REGO", "date": v["REGO"], "status": status})
            if alerts:
                warnings.append({"vehicle": v["Vehicle"], "plate": v["Plate"], "id": v["id"], "alerts": alerts})

        return {"status": "success", "data": warnings, "count": len(warnings)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/reminders/others")
async def api_get_other_reminders():
    try:
        rows = db_client.fetch_all("SELECT * FROM tb_reminder_other ORDER BY expiry_date ASC")
        return {"status": "success", "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/reminders/others")
async def api_create_other_reminder(data: OtherReminderCreate):
    try:
        db_client.execute_query(
            "INSERT INTO tb_reminder_other (name, comment, expiry_date) VALUES (?, ?, ?)",
            (data.name, data.comment, data.expiry_date)
        )
        return {"status": "success", "message": f"Reminder '{data.name}' added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/reminders/others/{reminder_id}")
async def api_update_other_reminder(reminder_id: int, data: OtherReminderUpdate):
    try:
        existing = db_client.fetch_one("SELECT id FROM tb_reminder_other WHERE id = ?", (reminder_id,))
        if not existing:
            raise HTTPException(status_code=404, detail="Reminder not found")
        db_client.execute_query(
            "UPDATE tb_reminder_other SET name = ?, comment = ?, expiry_date = ? WHERE id = ?",
            (data.name, data.comment, data.expiry_date, reminder_id)
        )
        return {"status": "success", "message": "Reminder updated successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/reminders/others/{reminder_id}")
async def api_delete_other_reminder(reminder_id: int):
    try:
        db_client.execute_query("DELETE FROM tb_reminder_other WHERE id = ?", (reminder_id,))
        return {"status": "success", "message": "Reminder deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/reminders/others/expiry-check")
async def api_other_reminder_expiry_check():
    try:
        today = date.today()
        warn_date = today + timedelta(days=30)
        today_str = today.isoformat()
        warn_str = warn_date.isoformat()

        rows = db_client.fetch_all("SELECT * FROM tb_reminder_other WHERE expiry_date IS NOT NULL ORDER BY expiry_date ASC")
        warnings = []
        for r in rows:
            if r.get("expiry_date") and r["expiry_date"] <= warn_str:
                status = "expired" if r["expiry_date"] < today_str else "expiring_soon"
                warnings.append({
                    "id": r["id"],
                    "name": r["name"],
                    "comment": r.get("comment"),
                    "expiry_date": r["expiry_date"],
                    "status": status
                })
        return {"status": "success", "data": warnings, "count": len(warnings)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/reminders/staff/expiry-check")
async def api_staff_expiry_check():
    try:
        today = date.today()
        warn_date = today + timedelta(days=30)
        today_str = today.isoformat()
        warn_str = warn_date.isoformat()

        query = """
            SELECT id, login, firstname, surname, role, site_safe_passport, site_safe_category, site_safe_exp_date
            FROM tb_login
            WHERE site_safe_exp_date IS NOT NULL AND site_safe_exp_date <= ? AND admin_validation = 1 AND (is_active = 1 OR is_active IS NULL)
        """
        expired_staff = db_client.fetch_all(query, (warn_str,))
        
        warnings = []
        for s in expired_staff:
            status = "expired" if s["site_safe_exp_date"] < today_str else "expiring"
            warnings.append({
                "id": s["id"],
                "login": s["login"],
                "name": f"{s['firstname']} {s['surname']}",
                "role": s["role"],
                "passport": s["site_safe_passport"],
                "category": s["site_safe_category"],
                "expiry_date": s["site_safe_exp_date"],
                "status": status
            })

        return {"status": "success", "data": warnings, "count": len(warnings)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
