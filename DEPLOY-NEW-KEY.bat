@echo off
echo Building with new API key...
call npm run build

echo.
echo Pushing to GitHub...
git add services/geminiService.ts
git add .env.local
git commit -m "Update API key"
git push origin main

echo.
echo ================================================
echo DEPLOYED!
echo ================================================
echo.
echo Render will auto-deploy in 1-2 minutes.
echo Then test your site - the AI should work now!
echo.
echo IMPORTANT SECURITY NOTE:
echo - Never share API keys publicly again
echo - Anyone who saw these keys can use them
echo - Consider rotating all exposed keys
echo.
pause
