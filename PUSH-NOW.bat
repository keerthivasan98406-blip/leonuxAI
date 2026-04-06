@echo off
cls
echo.
echo ========================================
echo   FIXING 404 ERROR - PUSHING TO GITHUB
echo ========================================
echo.

git add -A
git commit -m "Fix 404 error - Remove Render config and add instructions"
git push origin main

echo.
echo ========================================
echo   PUSHED! NOW DO THIS:
echo ========================================
echo.
echo 1. Open: https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo.
echo 2. Under "Source", select "GitHub Actions"
echo.
echo 3. Click Save
echo.
echo 4. Wait 3 minutes
echo.
echo 5. Your site will work: https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
echo ========================================
echo.
pause
