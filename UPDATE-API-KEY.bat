@echo off
echo ========================================
echo UPDATING API KEY FOR RENDER DEPLOYMENT
echo ========================================

echo.
echo Step 1: Building with new API key...
npm run build

echo.
echo Step 2: Committing API key update...
git add .
git commit -m "Update OpenRouter API key in render.yaml"

echo.
echo Step 3: Pushing to GitHub (triggers Render deployment)...
git push origin main

echo.
echo ========================================
echo API KEY UPDATE COMPLETE!
echo ========================================
echo.
echo Your new API key will be active at:
echo https://leonux-ai.onrender.com
echo.
echo API Key: Set in Render dashboard environment variables
echo.
echo Note: It may take 2-3 minutes for Render to rebuild and deploy.
echo.
pause