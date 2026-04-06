@echo off
echo ========================================
echo Testing GitHub Pages Setup
echo ========================================
echo.

echo Adding test file...
git add test-github-pages.html
git commit -m "Add GitHub Pages test file"
git push origin main

echo.
echo ========================================
echo Test file pushed!
echo ========================================
echo.
echo Now check:
echo 1. https://keerthivasan98406-blip.github.io/leonuxAI/test-github-pages.html
echo.
echo If you see the test page:
echo   ✓ GitHub Pages is enabled
echo   → The main site issue is with the workflow
echo.
echo If you see 404:
echo   ✗ GitHub Pages is NOT enabled
echo   → Go to: https://github.com/keerthivasan98406-blip/leonuxAI/settings/pages
echo   → Select "GitHub Actions" as source
echo.
pause
