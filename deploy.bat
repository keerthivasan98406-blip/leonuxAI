@echo off
echo ========================================
echo Leonux AI - GitHub Pages Deployment
echo ========================================
echo.

echo Step 1: Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful!
echo.

echo Step 2: Checking dist folder...
if not exist "dist\index.html" (
    echo ERROR: dist\index.html not found!
    pause
    exit /b 1
)
if not exist "dist\assets" (
    echo ERROR: dist\assets folder not found!
    pause
    exit /b 1
)
echo ✓ Dist folder is ready!
echo.

echo Step 3: Adding files to git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed!
    pause
    exit /b 1
)
echo ✓ Files added!
echo.

echo Step 4: Committing changes...
git commit -m "Deploy to GitHub Pages"
if %errorlevel% neq 0 (
    echo Note: No changes to commit or commit failed
)
echo.

echo Step 5: Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Git push failed!
    pause
    exit /b 1
)
echo ✓ Pushed to GitHub!
echo.

echo ========================================
echo IMPORTANT: Manual Steps Required!
echo ========================================
echo.
echo 1. Enable GitHub Pages:
echo    Go to: https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo    Select "GitHub Actions" as source
echo    Click Save
echo.
echo 2. Add API Key Secret:
echo    Go to: https://github.com/keerthivasan98406-blip/leonuxAI/settings/secrets/actions
echo    Click "New repository secret"
echo    Name: VITE_OPENROUTER_API_KEY
echo    Value: (your API key from .env.local)
echo.
echo 3. Check deployment:
echo    Go to: https://github.com/keerthivasan98406-blip/leonuxAI/actions
echo    Wait for green checkmark
echo.
echo 4. Your site will be live at:
echo    https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
echo ========================================
pause
