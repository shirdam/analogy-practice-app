@echo off
echo 🎓 Starting Analogy Practice App...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first:
    echo    https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Copy question files to public directory
echo 📚 Setting up question database...
if not exist "public\analogies_completed_items" mkdir "public\analogies_completed_items"
xcopy "analogies_completed_items\*.jsonl" "public\analogies_completed_items\" /Y

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo    1. Open Command Prompt 1: cd backend ^&^& npm start
echo    2. Open Command Prompt 2: npm start
echo    3. Open http://localhost:3000 in your browser
echo.
echo 📖 For detailed instructions, see HOW_TO_RUN.md
echo.
pause
