@echo off
cls
echo.
echo ================================================
echo   CRITICAL SECURITY FIX
echo ================================================
echo.
echo Removing API key from console logs...
echo.

call npm run build

echo.
echo Pushing to GitHub...
git add services/geminiService.ts
git add dist
git commit -m "SECURITY: Remove API key from console logs"
git push origin main

echo.
echo ================================================
echo   SECURITY FIX DEPLOYED!
echo ================================================
echo.
echo The API key will no longer be visible in the browser console.
echo.
echo IMPORTANT: 
echo - The API key that was exposed should be rotated
echo - Go to https://openrouter.ai/keys
echo - Delete the exposed key
echo - Create a new one
echo.
pause
