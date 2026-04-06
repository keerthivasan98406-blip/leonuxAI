@echo off
echo ========================================
echo MOBILE HEADER FIX - LEONUX AI
echo ========================================

echo.
echo Step 1: Building the project...
npm run build

echo.
echo Step 2: Checking build output...
dir dist

echo.
echo Step 3: Committing changes...
git add .
git commit -m "Fix mobile header visibility issue - simplified header with fallback styles"

echo.
echo Step 4: Pushing to GitHub (triggers Render deployment)...
git push origin main

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your mobile header fix will be live at:
echo https://leonux-ai.onrender.com
echo.
echo Changes made:
echo - Simplified mobile header with basic Tailwind classes
echo - Removed complex CSS that might not work on mobile
echo - Added hamburger menu symbol instead of FontAwesome
echo - Used simple emerald color scheme
echo - Made header always visible on mobile screens
echo.
pause