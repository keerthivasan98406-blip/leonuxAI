@echo off
git add services/geminiService.ts
git commit -m "Add fallback API key for Render deployment"
git push origin main
echo.
echo Pushed! Render will auto-deploy.
echo The AI should work now!
pause
