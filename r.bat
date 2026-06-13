@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Starting Steelworks Manager (React Version)...
echo ===================================================

:: Clean port 3700 if active
echo Cleaning port 3700...
powershell -Command "Get-NetTCPConnection -LocalPort 3700 -ErrorAction SilentlyContinue | Foreach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: Clean port 3701 if active
echo Cleaning port 3701...
powershell -Command "Get-NetTCPConnection -LocalPort 3701 -ErrorAction SilentlyContinue | Foreach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: 1. Start Python API Backend in the background (same window)
echo Starting FastAPI Backend Server (Port: 3700)...
start /b python run_api.py

:: 2. Start Next.js Frontend Server in the background (same window)
echo Starting Next.js Frontend Dev Server (Port: 3701)...
cd fe
start /b npm run dev

echo ===================================================
echo Both servers have been launched in the background.
echo API Backend: http://localhost:3700
echo Web Frontend: http://localhost:3701
echo ===================================================
echo.
pause
endlocal


