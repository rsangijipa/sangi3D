@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js para abrir a Bussola do Corpo.
  pause
  exit /b 1
)
node scripts\serve.mjs --open
if errorlevel 1 pause

