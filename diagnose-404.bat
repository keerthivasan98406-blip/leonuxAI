@echo off
echo ========================================
echo Diagnosing 404 Error
echo ========================================
echo.

echo Testing possible backend URLs...
echo.

echo 1. Testing leonuxai-2.onrender.com...
curl -s https://leonuxai-2.onrender.com/api/health
echo.
echo.

echo 2. Testing leonuxai-3.onrender.com...
curl -s https://leonuxai-3.onrender.com/api/health
echo.
echo.

echo 3. Testing leonux-ai-backend.onrender.com...
curl -s https://leonux-ai-backend.onrender.com/api/health
echo.
echo.

echo ========================================
echo Which one worked?
echo ========================================
echo.
echo If you saw a JSON response with "status":"OK",
echo that's your correct backend URL!
echo.
echo Update render.yaml with that URL and redeploy.
echo.
echo See fix-404-urls.md for detailed instructions.
echo ========================================

pause
