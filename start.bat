@echo off
setlocal enabledelayedexpansion
title RuoYi All Next - Start Manager

cd /d "%~dp0"

echo ================================================================
echo          RuoYi All Next - Developer Launcher
echo ================================================================
echo.

REM 1. Check Node.js and npm
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js v20+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found in PATH.
    echo.
    pause
    exit /b 1
)

REM 2. Parse Mode
set "MODE=%~1"

if "%MODE%"=="" (
    echo Please select startup mode:
    echo   [1] Fast Local Dev Mode - Next.js at http://localhost:3100 [Recommended]
    echo   [2] Full Docker Mode - PostgreSQL:5433 + Redis:6380 + Next.js
    echo   [3] Infrastructure Only - Start DB + Redis containers
    echo   [4] Architecture Governance Check - npm run check
    echo   [5] Stop Project Docker Containers
    echo.
    set /p "CHOICE=Enter number [default 1]: "
    if "!CHOICE!"=="" set "CHOICE=1"
    if "!CHOICE!"=="1" set "MODE=app"
    if "!CHOICE!"=="2" set "MODE=dev"
    if "!CHOICE!"=="3" set "MODE=infra"
    if "!CHOICE!"=="4" set "MODE=check"
    if "!CHOICE!"=="5" set "MODE=stop"
)

if /I "%MODE%"=="help" goto :help
if /I "%MODE%"=="-h" goto :help
if /I "%MODE%"=="--help" goto :help
if /I "%MODE%"=="app" goto :app
if /I "%MODE%"=="dev" goto :dev
if /I "%MODE%"=="infra" goto :infra
if /I "%MODE%"=="docker" goto :docker
if /I "%MODE%"=="memory" goto :memory
if /I "%MODE%"=="check" goto :check
if /I "%MODE%"=="status" goto :status
if /I "%MODE%"=="stop" goto :stop

echo [ERROR] Unknown mode: %MODE%
goto :help

:app
echo [INFO] Starting Next.js development server...
echo [INFO] Access Homepage: http://localhost:3100
echo [INFO] Access Admin:    http://localhost:3100/login
echo.
call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [TIP] If dependencies are missing, run: npm install
    pause
)
goto :end

:dev
echo [INFO] Checking Docker environment...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] Docker is not installed or not in PATH.
    echo [WARN] Automatically falling back to Fast Local Dev Mode...
    echo.
    goto :app
)

docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARN] Docker daemon is not running.
    echo [WARN] Automatically falling back to Fast Local Dev Mode...
    echo.
    goto :app
)

echo [STEP] Starting PostgreSQL and Redis containers...
docker compose -f deploy/docker-compose.dev.yml up -d --wait postgres redis
if %errorlevel% neq 0 (
    echo [WARN] Docker containers failed to start. Falling back to local mode...
    goto :app
)

echo [STEP] Applying database migrations and seed data...
call npm run db:generate
call npm run db:migrate
call npm run db:seed

echo [OK] Infrastructure is ready.
goto :app

:infra
echo [INFO] Starting PostgreSQL and Redis containers...
docker compose -f deploy/docker-compose.dev.yml up -d --wait postgres redis
call npm run db:generate
call npm run db:migrate
call npm run db:seed
echo [OK] Infrastructure containers are running.
pause
goto :end

:docker
echo [STEP] Building and starting complete Docker compose stack...
docker compose -f deploy/docker-compose.dev.yml up -d --build
echo [OK] App running in Docker at http://localhost:3100
pause
goto :end

:memory
echo [INFO] Starting in pure in-memory mode...
set "DB_DRIVER=memory"
set "DATABASE_URL=memory://ruoyi-all-next"
set "REDIS_URL="
call npm run dev
goto :end

:check
echo [STEP] Running governance and lint checks...
call npm run check
echo.
pause
goto :end

:status
docker compose -f deploy/docker-compose.dev.yml ps
pause
goto :end

:stop
echo [STEP] Stopping Docker services...
docker compose -f deploy/docker-compose.dev.yml down
echo [OK] Containers stopped.
pause
goto :end

:help
echo Usage: start.bat [mode]
echo.
echo Available modes:
echo   app     - Fast local Next.js dev server: http://localhost:3100
echo   dev     - Start Docker DB/Redis, migrate, and run Next.js
echo   infra   - Start DB/Redis containers only
echo   docker  - Full Docker containerized deployment
echo   memory  - In-memory dev server
echo   check   - Run matrix, domain, and governance checks
echo   status  - Show Docker container status
echo   stop    - Stop all project containers
echo.

:end
endlocal
