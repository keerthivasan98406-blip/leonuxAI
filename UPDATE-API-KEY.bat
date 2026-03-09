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
echo New API Key: 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
echo.
echo Note: It may take 2-3 minutes for Render to rebuild and deploy.
echo.
pause