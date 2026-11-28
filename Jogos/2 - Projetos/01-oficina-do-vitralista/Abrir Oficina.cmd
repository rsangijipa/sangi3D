@echo off
cd /d "%~dp0"
node servir.mjs --abrir
if errorlevel 1 pause
