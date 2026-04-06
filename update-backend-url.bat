@echo off
git add render.yaml
git commit -m "Fix: Update frontend backend URL to leonuxai-2"
git push origin main
echo.
echo Pushed! Render will redeploy automatically.
pause
