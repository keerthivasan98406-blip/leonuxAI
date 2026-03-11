@echo off
echo Pushing backend fix to GitHub...
git add server/index.js render.yaml start-server.js CHECK-THIS-NOW.md
git commit -m "Fix backend deployment - add proper start script and logging"
git push
echo.
echo Done! Wait 2-3 minutes for Render to redeploy.
echo Then test: https://leonuxai-2.onrender.com/api/health
pause
