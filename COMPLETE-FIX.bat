@echo off
cls
echo.
echo ================================================
echo   COMPLETE FIX FOR GITHUB PAGES
echo ================================================
echo.

echo Step 1: Deleting old build folders...
if exist dist rmdir /s /q dist
if exist docs rmdir /s /q docs
echo ✓ Old folders deleted
echo.

echo Step 2: Building with correct base path...
call npm run build
echo ✓ Build complete
echo.

echo Step 3: Renaming dist to docs...
move dist docs
echo ✓ Renamed to docs
echo.

echo Step 4: Verifying docs folder...
if exist docs\index.html (
    echo ✓ docs/index.html exists
) else (
    echo ✗ ERROR: docs/index.html not found!
    pause
    exit /b 1
)

if exist docs\assets (
    echo ✓ docs/assets folder exists
) else (
    echo ✗ ERROR: docs/assets not found!
    pause
    exit /b 1
)
echo.

echo Step 5: Adding to git...
git add -A
echo ✓ Files added
echo.

echo Step 6: Committing...
git commit -m "Fix GitHub Pages deployment with correct base path"
echo ✓ Committed
echo.

echo Step 7: Pushing to GitHub...
git push origin main
echo ✓ Pushed
echo.

echo ================================================
echo   SUCCESS! BUILD COMPLETE
echo ================================================
echo.
echo The docs folder now has the correct paths:
echo   /leonuxAI/assets/index-[hash].js
echo.
echo ================================================
echo   FINAL STEP - ENABLE GITHUB PAGES
echo ================================================
echo.
echo 1. Go to: https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo.
echo 2. Configure:
echo    - Source: "Deploy from a branch"
echo    - Branch: "main"
echo    - Folder: "/docs"
echo    - Click Save
echo.
echo 3. Wait 2-3 minutes
echo.
echo 4. Your site will be live at:
echo    https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
echo ================================================
echo.
pause
