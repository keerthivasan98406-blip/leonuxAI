@echo off
echo ========================================
echo FIXING MOBILE HEADER FLICKERING ISSUE
echo ========================================

echo.
echo Step 1: Building with fixed mobile header...
npm run build

echo.
echo Step 2: Committing mobile header fix...
git add .
git commit -m "Fix mobile header flickering - make header permanently fixed on mobile"

echo.
echo Step 3: Pushing to GitHub (triggers Render deployment)...
git push origin main

echo.
echo ========================================
echo MOBILE HEADER FIX COMPLETE!
echo ========================================
echo.
echo Changes made:
echo - Made mobile header position: fixed instead of relative
echo - Added spacer div to prevent content overlap
echo - Added mobile-specific CSS to prevent browser hiding
echo - Used hardware acceleration for smooth performance
echo - Added viewport height fixes for mobile browsers
echo.
echo Your mobile header will now stay fixed at:
echo https://leonux-ai.onrender.com
echo.
pause