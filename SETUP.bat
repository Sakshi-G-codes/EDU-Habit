@echo off
echo ========================================
echo   EDU-HABIT - Initial Setup
echo ========================================
echo.
echo This script will install all dependencies.
echo Please wait, this may take a few minutes...
echo.

echo [1/2] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/2] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Setup MySQL database (see INSTALLATION.md)
echo 2. Configure backend/.env with your MySQL credentials
echo 3. Run START_BACKEND.bat
echo 4. Run START_FRONTEND.bat (in a new window)
echo.
echo For detailed instructions, see INSTALLATION.md
echo.
pause
