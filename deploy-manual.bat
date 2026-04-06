@echo off
echo Building project...
call npm run build

echo.
echo Copying dist contents to docs folder for GitHub Pages...
if exist docs rmdir /s /q docs
mkdir docs
xcopy /E /I /Y dist\* docs\

echo.
echo Adding to git...
git add docs
git add -A
git commit -m "Deploy built files to docs folder"
git push origin main

echo.
echo ================================================
echo DONE! Now do this:
echo ================================================
echo.
echo 1. Go to: https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo 2. Under "Build and deployment":
echo    - Source: "Deploy from a branch"
echo    - Branch: "main"
echo    - Folder: "/docs"
echo 3. Click Save
echo.
echo Your site will be live at:
echo https://keerthivasan98406-blip.github.io/leonuxAI/
echo.
pause
