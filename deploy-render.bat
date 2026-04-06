@echo off
echo Building Leonux AI for Render deployment...

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building the project...
call npm run build

echo.
echo Step 3: Committing changes to Git...
git add .
git commit -m "Deploy to Render: Fixed mobile header, security issues, and API key"

echo.
echo Step 4: Pushing to GitHub (Render will auto-deploy)...
git push origin main

echo.
echo ✅ Deployment complete! 
echo.
echo Your site will be available at: https://leonux-ai.onrender.com
echo.
echo Note: It may take 2-3 minutes for Render to build and deploy.
echo.
pause