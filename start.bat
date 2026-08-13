@echo off
setlocal
cd /d "%~dp0"

set "MODE=%~1"
if "%MODE%"=="" set "MODE=dev"

if /I "%MODE%"=="help" goto :help
if /I "%MODE%"=="-h" goto :help
if /I "%MODE%"=="--help" goto :help
if /I "%MODE%"=="infra" goto :infra
if /I "%MODE%"=="app" goto :app
if /I "%MODE%"=="dev" goto :dev
if /I "%MODE%"=="docker" goto :docker
if /I "%MODE%"=="memory" goto :memory
if /I "%MODE%"=="status" goto :status
if /I "%MODE%"=="stop" goto :stop

echo [ERROR] Unknown mode: %MODE%
goto :help

:require_tools
where docker >nul 2>nul || (echo [ERROR] Docker is required.& exit /b 1)
where npm >nul 2>nul || (echo [ERROR] Node.js and npm are required.& exit /b 1)
exit /b 0

:infra
call :require_tools || goto :end
echo [STEP] Starting PostgreSQL ^(5433^) and Redis ^(6380^)...
docker compose -f deploy/docker-compose.dev.yml up -d --wait postgres redis || goto :end
echo [STEP] Generating Prisma client, applying migrations, and seeding development access...
call npm run db:generate || goto :end
call npm run db:migrate || goto :end
call npm run db:seed || goto :end
echo [OK] Infrastructure is ready; sign in with admin/admin123.
goto :end

:app
where npm >nul 2>nul || (echo [ERROR] Node.js and npm are required.& goto :end)
echo [INFO] Starting Next.js at http://localhost:3100
call npm run dev
goto :end

:dev
call :infra || goto :end
call :app
goto :end

:docker
call :infra || goto :end
echo [STEP] Building and starting the Docker app at http://localhost:3100...
docker compose -f deploy/docker-compose.dev.yml up -d --build app
goto :end

:memory
where npm >nul 2>nul || (echo [ERROR] Node.js and npm are required.& goto :end)
echo [INFO] Starting in-memory mode at http://localhost:3100
set "DB_DRIVER=memory"
set "DATABASE_URL=memory://ruoyi-all-next"
set "REDIS_URL="
call npm run dev
goto :end

:status
docker compose -f deploy/docker-compose.dev.yml ps
goto :end

:stop
echo [STEP] Stopping project Docker services; volumes are preserved.
docker compose -f deploy/docker-compose.dev.yml down
goto :end

:help
echo Usage: start.bat [dev^|infra^|app^|docker^|memory^|status^|stop]
echo.
echo   dev     Default. Start PostgreSQL + Redis, run migrations, then run Next.js.
echo   infra   Start PostgreSQL:5433 and Redis:6380, then run migrations.
echo   app     Run Next.js only, using .env.local.
echo   docker  Start infrastructure, migrate, then build and start the app container.
echo   memory  Run Next.js with in-memory persistence and no Redis.
echo   status  Show dev Docker services.
echo   stop    Stop project dev Docker services without deleting volumes.

:end
endlocal
