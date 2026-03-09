@echo off
echo ========================================
echo Pushing All Changes to GitHub
echo ========================================
echo.

echo Step 1: Adding all files...
git add -A
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

echo Step 2: Committing changes...
git commit -m "Add deployment scripts and fixes"
if %errorlevel% neq 0 (
    echo Note: No changes to commit or commit failed
)
echo.

echo Step 3: Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)
echo ✓ Pushed successfully!
echo.

echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Enable GitHub Pages:
echo    https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo    Select "GitHub Actions" as source
echo.
echo 2. Test if GitHub Pages is enabled:
echo    https://keerthivasan98406-blip.github.io/leonuxAI/test-github-pages.html
echo.
echo 3. Check workflow status:
echo    https://github.com/keerthivasan98406-blip/leonuxAI/actions
echo.
echo 4. Your main site:
echo    https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
pause
