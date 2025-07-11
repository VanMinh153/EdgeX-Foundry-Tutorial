@echo off
echo Starting EdgeX Swagger UI Proxy Server...
echo.
echo This will start a proxy server on http://localhost:3000
echo to avoid CORS issues when using Swagger UI with EdgeX APIs
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting proxy server...
npm start
