@echo off
title GeoVisionAI Platform Launcher
echo ===================================================
echo Starting GeoVisionAI Platform (Backend + Frontend)
echo ===================================================

set PY_PATH=D:\GeoVission-CapstoneProject\GEOVISION-AI-RESEARCH-FINAL-2026\GEOVISION-AI-RESEARCH-FINAL-2026\backend\.venv\Scripts\python.exe
if not exist "%PY_PATH%" (
    if exist "%~dp0backend\.venv\Scripts\python.exe" (
        set PY_PATH=%~dp0backend\.venv\Scripts\python.exe
    ) else (
        set PY_PATH=python
    )
)

start "GeoVisionAI Backend (Port 8000)" cmd /k "cd /d %~dp0backend && ""%PY_PATH%"" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

start "GeoVisionAI Frontend (Port 5173)" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 3 >nul
start http://localhost:5173
