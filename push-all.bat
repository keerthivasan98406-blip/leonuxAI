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
git commit -m "Remove Render config and fix 404 reload issue"
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
echo The Render deployment error is fixed!
echo.
echo Your site is deploying to GitHub Pages:
echo https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
echo Check deployment status:
echo https://github.com/keerthivasan98406-blip/leonuxAI/actions
echo.
pause
