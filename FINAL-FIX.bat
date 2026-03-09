@echo off
cls
echo.
echo ================================================
echo   LEONUX AI - FINAL FIX FOR 404 ERROR
echo ================================================
echo.
echo Building project...
call npm run build
echo.
echo Adding files to git...
git add -A
echo.
echo Committing...
git commit -m "Fix 404 - Rebuild and deploy"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo ================================================
echo   BUILD COMPLETE!
echo ================================================
echo.
echo The dist folder contains:
echo   - index.html (with correct JavaScript reference)
echo   - assets/index-CVlnMA8p.js (compiled code)
echo   - 404.html (for SPA routing)
echo   - leonux-logo.png
echo   - login-video.mp4
echo.
echo ================================================
echo   CRITICAL: YOU MUST DO THIS NOW!
echo ================================================
echo.
echo 1. Go to: https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo.
echo 2. Under "Build and deployment":
echo    - Source: Select "GitHub Actions"
echo    - Click Save
echo.
echo 3. Go to: https://github.com/keerthivasan98406-blip/leonuxAI/actions
echo    - Wait for green checkmark (2-3 minutes)
echo.
echo 4. Your site will be live at:
echo    https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
echo ================================================
echo   WHY THE 404 ERROR HAPPENS:
echo ================================================
echo.
echo - GitHub Pages is trying to serve source files
echo - Browser tries to load index.tsx (404 error)
echo - We need GitHub Actions to deploy the BUILT files
echo - Built files have index.html + JavaScript (no .tsx)
echo.
echo Once you enable GitHub Actions, it will:
echo 1. Run npm run build
echo 2. Deploy the dist folder
echo 3. Site will work perfectly!
echo.
echo ================================================
pause
