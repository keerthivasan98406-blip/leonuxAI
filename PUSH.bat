@echo off
git add -A
git commit -m "Final deployment with updated API key"
git push origin main
echo.
echo Pushed successfully!
echo Render will auto-deploy in 1-2 minutes.
pause
