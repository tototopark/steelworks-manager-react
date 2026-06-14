from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
import jwt
import bcrypt
from core import db_client

SECRET_KEY = "my_super_secret_jwt_key_for_steelworks"
ALGORITHM = "HS256"

router = APIRouter()

class LoginRequest(BaseModel):
    login: str
    password: str

class ChangePasswordRequest(BaseModel):
    temp_token: str
    new_password: str

def get_current_user_payload(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: No token provided")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token")

@router.post("/api/auth/login")
async def auth_login(payload: LoginRequest):
    try:
        from configs import app_config
        
        # 1. Super Admin Fallback (Bypass DB entirely)
        enable_super_admin = getattr(app_config, "ENABLE_SUPER_ADMIN", False)
        if enable_super_admin and \
           payload.login == getattr(app_config, "SUPER_ADMIN_LOGIN", "admin") and \
           payload.password == getattr(app_config, "SUPER_ADMIN_PASS", "12345678"):
            
            expire = datetime.utcnow() + timedelta(hours=24)
            to_encode = {"sub": payload.login, "right_level": 99, "exp": expire}
            token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
            return {
                "status": "success", 
                "token": token, 
                "right_level": 99,
                "user": {
                    "id": 0,
                    "login": payload.login,
                    "firstname": "System",
                    "surname": "Admin",
                    "right_level": 99
                }
            }
            
        # 2. Standard DB Check
        user = db_client.fetch_one("SELECT id, login, password, right_level, firstname, surname FROM tb_login WHERE login = ?", (payload.login,))
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
        # Standard hashed compare or plaintext 12345678 fallback
        valid_password = False
        if payload.password == "12345678" and user['password'] == "12345678":
            valid_password = True
        else:
            try:
                pw_bytes = payload.password.encode('utf-8')
                db_hash = user['password']
                if db_hash.startswith("$2y$"):
                    db_hash = db_hash.replace("$2y$", "$2b$", 1)
                if db_hash.endswith(":dev"):
                    db_hash = db_hash.split(":")[0]
                hash_bytes = db_hash.encode('utf-8')
                valid_password = bcrypt.checkpw(pw_bytes, hash_bytes)
            except Exception as e:
                print(f"Login verify exception: {e}")
                valid_password = False
            
        if not valid_password:
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
        if payload.password == "12345678":
            expire = datetime.utcnow() + timedelta(minutes=10)
            to_encode = {"sub": user['login'], "right_level": user['right_level'], "exp": expire, "require_change": True}
            temp_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
            return {"status": "require_change", "temp_token": temp_token, "message": "Initial password detected. Please change your password."}
            
        # Create JWT token
        expire = datetime.utcnow() + timedelta(hours=24)
        to_encode = {"sub": user['login'], "right_level": user['right_level'], "exp": expire}
        token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "status": "success", 
            "token": token, 
            "right_level": user['right_level'],
            "user": {
                "id": user['id'],
                "login": user['login'],
                "firstname": user['firstname'] or user['login'],
                "surname": user['surname'] or "",
                "right_level": user['right_level']
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/auth/change_password")
async def change_password(payload: ChangePasswordRequest):
    try:
        decoded = jwt.decode(payload.temp_token, SECRET_KEY, algorithms=[ALGORITHM])
        if not decoded.get("require_change"):
            raise HTTPException(status_code=400, detail="Invalid token for password change")
        
        login_id = decoded.get("sub")
        if not login_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        if len(payload.new_password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
            
        if payload.new_password == "12345678":
            raise HTTPException(status_code=400, detail="New password cannot be the default password")
            
        pw_bytes = payload.new_password.encode('utf-8')
        hashed_pw = bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode('utf-8')
        db_client.execute_query("UPDATE tb_login SET password = ? WHERE login = ?", (hashed_pw, login_id))
        
        right_level = decoded.get("right_level")
        expire = datetime.utcnow() + timedelta(hours=24)
        to_encode = {"sub": login_id, "right_level": right_level, "exp": expire}
        token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return {"status": "success", "token": token, "right_level": right_level}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/config")
async def get_config():
    try:
        from configs import app_config
        return {"status": "success", "data": {"AUTO_FILL_ENABLED": getattr(app_config, "AUTO_FILL_ENABLED", False)}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/config/dev_features")
async def api_get_dev_features():
    try:
        from configs.app_config import AUTO_FILL_ENABLED, SHOW_DEV_HINTS
        return {"status": "success", "auto_fill": AUTO_FILL_ENABLED, "dev_hints": SHOW_DEV_HINTS}
    except ImportError:
        return {"status": "success", "auto_fill": False, "dev_hints": False}
