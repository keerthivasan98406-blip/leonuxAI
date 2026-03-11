@echo off
git add server/index.js
git commit -m "Add logging to debug empty AI responses"
git push origin main
echo.
echo Pushed! Check Render logs after redeployment.
pause
