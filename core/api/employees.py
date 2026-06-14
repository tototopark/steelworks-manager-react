import os
import shutil
import random
import string
from datetime import date
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import bcrypt
from core import db_client

router = APIRouter()

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class EmployeeCreate(BaseModel):
    login: str
    password: str
    firstname: str
    surname: str
    role: Optional[str] = "Welder"
    right_level: Optional[int] = 1
    bay: Optional[int] = None
    shop_label: Optional[str] = None

class EmployeeUpdate(BaseModel):
    firstname: str
    surname: str
    role: Optional[str] = "Welder"
    right_level: Optional[int] = 1
    bay: Optional[int] = None
    shop_label: Optional[str] = None

@router.get("/api/employees")
async def get_employees(status: str = "active"):
    try:
        if status == "retired":
            query = "SELECT id, login, password, firstname, surname, role, right_level, bay, shop_label, avatar FROM tb_login WHERE is_active = 0 OR admin_validation = 0 ORDER BY login ASC"
        else:
            query = "SELECT id, login, password, firstname, surname, role, right_level, bay, shop_label, avatar FROM tb_login WHERE (is_active = 1 OR is_active IS NULL) AND admin_validation = 1 ORDER BY login ASC"
        
        employees = db_client.fetch_all(query)
        for emp in employees:
            h = emp.get("password") or ""
            if h == "12345678":
                emp["password_display"] = "12345678"
                emp["autofill_password"] = "12345678"
            elif h.endswith(":dev"):
                login_id = emp.get("login") or ""
                dev_pw = f"dev_{login_id}"
                emp["password_display"] = dev_pw
                emp["autofill_password"] = dev_pw
            else:
                # Dynamically check if the hash matches "dev12345"
                is_dev_val = False
                try:
                    hash_str = h
                    if hash_str.startswith("$2y$"):
                        hash_str = hash_str.replace("$2y$", "$2b$", 1)
                    is_dev_val = bcrypt.checkpw(b"dev12345", hash_str.encode('utf-8'))
                except Exception:
                    pass
                
                if is_dev_val:
                    emp["password_display"] = "dev12345"
                    emp["autofill_password"] = "dev12345"
                else:
                    emp["password_display"] = h
                    emp["autofill_password"] = h
                
        return {"status": "success", "data": employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/employees")
async def create_employee(payload: EmployeeCreate):
    try:
        exists = db_client.fetch_one("SELECT id FROM tb_login WHERE login = ?", (payload.login,))
        if exists:
            raise HTTPException(status_code=400, detail=f"Login ID '{payload.login}' already exists.")
            
        hashed_pw = bcrypt.hashpw(b"12345678", bcrypt.gensalt()).decode("utf-8")
        db_client.execute_query(
            """
            INSERT INTO tb_login (
                login, password, firstname, surname, avatar, bay,
                date_creation, role, right_level, shop_label, admin_validation, first_aid
            ) VALUES (?, ?, ?, ?, 'default.png', ?, ?, ?, ?, ?, 1, 0)
            """,
            (
                payload.login, hashed_pw, payload.firstname, payload.surname,
                payload.bay, date.today().isoformat(), payload.role, payload.right_level,
                payload.shop_label
            )
        )
        return {"status": "success", "message": f"Employee {payload.login} registered."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/employees/{emp_id}")
async def update_employee(emp_id: int, payload: EmployeeUpdate):
    try:
        db_client.execute_query(
            """
            UPDATE tb_login 
            SET firstname = ?, surname = ?, role = ?, right_level = ?, bay = ?, shop_label = ?
            WHERE id = ?
            """,
            (payload.firstname, payload.surname, payload.role, payload.right_level, payload.bay, payload.shop_label, emp_id)
        )
        return {"status": "success", "message": "Employee updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/employees/{emp_id}")
async def delete_employee(emp_id: int):
    try:
        db_client.execute_query("UPDATE tb_login SET is_active = 0, admin_validation = 0 WHERE id = ?", (emp_id,))
        return {"status": "success", "message": "Employee deactivated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/employees/{emp_id}/random-password")
async def generate_random_password(emp_id: int):
    try:
        user = db_client.fetch_one("SELECT id, login FROM tb_login WHERE id = ?", (emp_id,))
        if not user:
            raise HTTPException(status_code=404, detail="Employee not found")
            
        chars = string.ascii_letters + string.digits
        new_password = ''.join(random.choice(chars) for _ in range(8))
        
        pw_bytes = new_password.encode('utf-8')
        hashed_pw = bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode('utf-8')
        db_client.execute_query("UPDATE tb_login SET password = ? WHERE id = ?", (hashed_pw, emp_id))
        
        return {
            "status": "success", 
            "message": "Random password generated and saved.",
            "new_password": new_password
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/employees/{emp_id}/avatar")
async def upload_employee_avatar(emp_id: int, file: UploadFile = File(...)):
    try:
        user = db_client.fetch_one("SELECT id, login FROM tb_login WHERE id = ?", (emp_id,))
        if not user:
            raise HTTPException(status_code=404, detail="Employee not found")

        allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {ext}. Allowed: {', '.join(allowed)}")

        upload_dir = os.path.join(project_root, "static", "uploads", "avatars")
        os.makedirs(upload_dir, exist_ok=True)
        filename = f"{emp_id}{ext}"
        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb") as buf:
            shutil.copyfileobj(file.file, buf)

        avatar_url = f"/uploads/avatars/{filename}"
        db_client.execute_query("UPDATE tb_login SET avatar = ? WHERE id = ?", (avatar_url, emp_id))

        return {"status": "success", "message": "Avatar uploaded.", "avatar_url": avatar_url}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
