@echo off
cls
echo.
echo ================================================
echo   BUILDING AND DEPLOYING TO GITHUB PAGES
echo ================================================
echo.

echo Step 1: Cleaning old folders...
if exist dist rmdir /s /q dist
if exist docs rmdir /s /q docs
echo ✓ Cleaned
echo.

echo Step 2: Building project...
echo (This converts .tsx to .js automatically)
call npm run build
echo ✓ Built
echo.

echo Step 3: Renaming dist to docs...
move dist docs
echo ✓ Renamed
echo.

echo Step 4: Showing what was created...
echo.
echo docs folder contains:
dir docs /b
echo.
echo docs/assets folder contains:
dir docs\assets /b
echo.
echo Notice: No .tsx files! Only .js files!
echo.

echo Step 5: Pushing to GitHub...
git add docs
git add .env.local
git add services/geminiService.ts
git commit -m "Deploy with correct API key and built files"
git push origin main
echo ✓ Pushed
echo.

echo ================================================
echo   SUCCESS!
echo ================================================
echo.
echo Your .tsx files stayed as .tsx (for development)
echo But the docs folder has .js files (for production)
echo.
echo Now enable GitHub Pages:
echo   https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo   Source: Deploy from a branch
echo   Branch: main
echo   Folder: /docs
echo.
pause
