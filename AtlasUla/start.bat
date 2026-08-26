@echo off
echo =======================================================
echo ✈️  Starting AtlasUla Full-Stack MVP Dev Servers
echo =======================================================
echo.
echo 1. Migrating old files...
call node migrate.js
echo.
echo 2. Installing dependencies for workspaces...
call npm run setup
echo.
echo 3. Launching dev servers concurrently...
call npm run dev
pause
