@echo off
echo Building frontend...
call npm run build
echo.
echo Committing changes...
git add .
git commit -m "Add image compression to fix 413 payload too large error"
echo.
echo Pushing to GitHub...
git push
echo.
echo Done! Wait 2-3 minutes for Render to deploy.
pause
