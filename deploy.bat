@echo off
setlocal
set COMMIT_MSG=%~1
if "%COMMIT_MSG%"=="" set COMMIT_MSG="Auto-deploy update"

echo [1/3] Adding changes to Git...
git add -A

echo [2/3] Committing changes...
git commit -m "%COMMIT_MSG%"

echo [3/3] Pushing to GitHub (emworktester-cloud/scholarship)...
git push origin master

echo Deployment to GitHub Complete!
echo.
echo =======================================
echo LATEST COMMIT DEPLOYED:
git log -1 --format="%%h - %%s"
echo =======================================
endlocal
