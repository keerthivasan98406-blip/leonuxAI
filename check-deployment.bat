@echo off
echo ========================================
echo Checking Deployment Setup
echo ========================================
echo.

echo Checking files...
echo.

if exist "dist\index.html" (
    echo ✓ dist\index.html exists
) else (
    echo ✗ dist\index.html NOT FOUND - Run: npm run build
)

if exist "dist\assets" (
    echo ✓ dist\assets folder exists
) else (
    echo ✗ dist\assets folder NOT FOUND - Run: npm run build
)

if exist "dist\leonux-logo.png" (
    echo ✓ dist\leonux-logo.png exists
) else (
    echo ✗ dist\leonux-logo.png NOT FOUND
)

if exist "dist\login-video.mp4" (
    echo ✓ dist\login-video.mp4 exists
) else (
    echo ✗ dist\login-video.mp4 NOT FOUND
)

if exist ".github\workflows\deploy-simple.yml" (
    echo ✓ GitHub Actions workflow exists
) else (
    echo ✗ GitHub Actions workflow NOT FOUND
)

if exist ".env.local" (
    echo ✓ .env.local exists
) else (
    echo ✗ .env.local NOT FOUND
)

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Run: deploy.bat
echo    (This will build and push to GitHub)
echo.
echo 2. Enable GitHub Pages:
echo    https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo    Select "GitHub Actions"
echo.
echo 3. Add API Key:
echo    https://github.com/keerthivasan98406-blip/leonuxAI/settings/secrets/actions
echo.
pause
