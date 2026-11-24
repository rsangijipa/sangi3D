@echo off
setlocal
title Launcher - Ambientes 3D
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js ^(https://nodejs.org^) para abrir o Launcher.
  pause
  exit /b 1
)
node launcher\server.mjs --open
if errorlevel 1 pause
