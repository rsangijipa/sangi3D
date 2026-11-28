@echo off
chcp 65001 >nul
title Ambientes 3D
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Para abrir os jogos, instale o Node.js uma unica vez:
  echo   https://nodejs.org  -  baixe a versao LTS, instale e abra este arquivo de novo.
  echo.
  pause
  exit /b 1
)

node "Sistema\launcher\server.mjs" --open
if errorlevel 1 pause
