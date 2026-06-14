"""
core/api_router.py
Defines the FastAPI REST API backend and routes requests to modular sub-routers.
"""

import os
import sys
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Set project root path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

# Initialize FastAPI app
app = FastAPI(title="Steelworks Manager API Backend", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import sub-routers
from core.api.auth import router as auth_router, SECRET_KEY, ALGORITHM, get_current_user_payload
from core.api.jobs import router as jobs_router
from core.api.qa import router as qa_router
from core.api.employees import router as employees_router
from core.api.reminders import router as reminders_router
from core.api.punch import router as punch_router
from core.api.weekly_plan import router as weekly_plan_router
from core.api.holidays import router as holidays_router
from core.api.workload import router as workload_router
from core.api.activity import router as activity_router
from core.api.performance import router as performance_router
from core.api.admin import router as admin_router
from core.api.dashboard import router as dashboard_router

# Include sub-routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(qa_router)
app.include_router(employees_router)
app.include_router(reminders_router)
app.include_router(punch_router)
app.include_router(weekly_plan_router)
app.include_router(holidays_router)
app.include_router(workload_router)
app.include_router(activity_router)
app.include_router(performance_router)
app.include_router(admin_router)
app.include_router(dashboard_router)

# Mount uploads folder directly to serve user avatars and job photos
static_dir = os.path.join(project_root, "static")
uploads_dir = os.path.join(static_dir, "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Empty favicon to avoid 404
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# Serve resume static HTML directly to prevent 404 in static export routing
@app.get("/resume", include_in_schema=False)
async def serve_resume():
    resume_path = os.path.join(static_dir, "resume.html")
    if os.path.exists(resume_path):
        return FileResponse(resume_path)
    # Fallback to subdirectory index if exists
    alt_path = os.path.join(static_dir, "resume", "index.html")
    if os.path.exists(alt_path):
        return FileResponse(alt_path)
    return Response(content="Resume page not found.", status_code=404)

# Serve login static HTML directly to prevent 404 upon sign out / redirect
@app.get("/login", include_in_schema=False)
async def serve_login():
    login_path = os.path.join(static_dir, "login.html")
    if os.path.exists(login_path):
        return FileResponse(login_path)
    # Fallback to subdirectory index if exists
    alt_path = os.path.join(static_dir, "login", "index.html")
    if os.path.exists(alt_path):
        return FileResponse(alt_path)
    return Response(content="Login page not found.", status_code=404)

# Mount StaticFiles as catch-all at the absolute bottom
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
