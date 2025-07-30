@echo off
echo DreamArq Portfolio - Project Tools
echo ====================================
echo.
echo This script helps you manage your architecture portfolio projects.
echo.

:menu
echo Choose an option:
echo 1. Create metadata for projects without project.json files
echo 2. Generate HTML pages for all projects
echo 3. Run both actions
echo 4. Exit
echo.

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" goto create_metadata
if "%choice%"=="2" goto generate_pages
if "%choice%"=="3" goto run_both
if "%choice%"=="4" goto end

echo Invalid choice! Please try again.
echo.
goto menu

:create_metadata
echo.
echo Creating metadata for projects...
node generate-project-metadata.js
echo.
pause
goto menu

:generate_pages
echo.
echo Generating HTML pages for all projects...
node generate-project-pages.js
echo.
pause
goto menu

:run_both
echo.
echo Creating metadata for projects...
node generate-project-metadata.js
echo.
echo Generating HTML pages for all projects...
node generate-project-pages.js
echo.
pause
goto menu

:end
echo Goodbye!
exit /b 0
