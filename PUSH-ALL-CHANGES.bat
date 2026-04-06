@echo off
cls
echo.
echo ================================================
echo   PUSHING ALL CHANGES TO GITHUB
echo ================================================
echo.

echo Adding all files...
git add -A

echo.
echo Committing...
git commit -m "Final deployment setup with docs folder"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ================================================
echo   PUSHED SUCCESSFULLY!
echo ================================================
echo.
echo Now enable GitHub Pages:
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
