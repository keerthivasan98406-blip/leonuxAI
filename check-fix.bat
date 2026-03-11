@echo off
echo ========================================
echo Checking Leonux AI Deployment Status
echo ========================================
echo.

echo 1. Testing Backend Health...
curl -s https://leonuxai-2.onrender.com/api/health
echo.
echo.

echo 2. Testing Chat Endpoint...
echo Sending test message to backend...
node test-render-chat.js
echo.
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. Wait for Render frontend deployment to complete (2-3 minutes)
echo 2. Open your deployed frontend URL in browser
echo 3. Open browser console (F12)
echo 4. Send a message and check if AI responds
echo 5. If still empty, hard refresh (Ctrl+Shift+R)
echo.
echo Or open test-deployed-chat.html in browser for direct testing
echo ========================================

pause
