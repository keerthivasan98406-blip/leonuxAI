@echo off
echo Building with logo fix...
call npm run build

echo.
echo Pushing to GitHub...
git add App.tsx
git add dist
git commit -m "Fix mobile header logo - show actual logo instead of icon"
git push origin main

echo.
echo ================================================
echo LOGO FIX DEPLOYED!
echo ================================================
echo.
echo The Leonux logo will now appear in the mobile header.
echo Render will auto-deploy in 1-2 minutes.
echo.
pause
