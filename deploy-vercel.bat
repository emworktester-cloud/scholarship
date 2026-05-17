@echo off
setlocal enabledelayedexpansion

echo =======================================
echo VERCEL DIRECT DEPLOYMENT SCRIPT (Zero-Touch)
echo =======================================

:: 1. Load Environment Variables from .env
if exist .env (
    for /f "usebackq tokens=1,* delims==" %%A in (.env) do (
        set "%%A=%%B"
    )
) else (
    echo [ERROR] .env file not found!
    exit /b 1
)

:: 2. Check for required tokens
if "%VERCEL_TOKEN%"=="" (
    echo [ERROR] VERCEL_TOKEN is not set in .env!
    echo Please add VERCEL_TOKEN=your_token_here to .env
    exit /b 1
)

:: 3. Ensure .vercel directory and project.json exist
if not exist ".vercel" mkdir .vercel
echo { "projectId": "prj_47vf8xjsgd9wyHsdRWCKJilNFTdi", "orgId": "emworktester-clouds-projects" } > .vercel\project.json

:: 4. Build the application
echo.
echo [1/2] Building project for production...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    exit /b %errorlevel%
)

:: 5. Deploy directly to Vercel
echo.
echo [2/2] Deploying to Vercel...
:: Unset environment variables that might conflict with the project.json or scope
set VERCEL_ORG_ID=
set VERCEL_PROJECT_ID=
call npx vercel deploy --prod --token %VERCEL_TOKEN% --scope emworktester-clouds-projects --yes
if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed!
    exit /b %errorlevel%
)

echo.
echo =======================================
echo DEPLOYMENT COMPLETE!
echo =======================================
