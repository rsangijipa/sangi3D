@echo off
where python >nul 2>nul
if not errorlevel 1 (
  python "%~dp0jogar.py"
  exit /b
)
py -3 "%~dp0jogar.py"
