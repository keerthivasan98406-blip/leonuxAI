@echo off
echo Cleaning old docs folder...
if exist docs rmdir /s /q docs

echo.
echo Building project...
call npm run build

echo.
echo Copying dist to docs...
mkdir docs
xcopy /E /I /Y dist\* docs\

echo.
echo Done! The docs folder is ready.
echo.
echo Now push to GitHub:
echo   git add docs
echo   git commit -m "Rebuild docs folder with correct paths"
echo   git push origin main
echo.
echo Then enable GitHub Pages:
echo   https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo   Source: Deploy from a branch
echo   Branch: main
echo   Folder: /docs
echo.
pause
