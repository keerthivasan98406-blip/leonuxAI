@echo off
git add render.yaml .env.local
git commit -m "Fix: Frontend deployment with correct backend URL"
git push origin main
pause
