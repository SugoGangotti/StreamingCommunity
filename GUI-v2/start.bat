@echo off
echo StreamingCommunity - Full Stack Setup
echo ====================================

if "%1"=="install" (
    echo Installing Node.js dependencies...
    npm install
    echo Installing Python dependencies...
    cd backend
    pip install -r requirements.txt
    cd ..
    echo Setup complete!
    goto end
)

if "%1"=="setup" (
    echo Setting up database...
    cd backend
    python manage.py migrate
    cd ..
    echo Database setup complete!
    goto end
)

if "%1"=="dev" (
    echo Starting both frontend and backend...
    echo Frontend: http://localhost:5173
    echo Backend:  http://localhost:8000
    echo.
    echo Press Ctrl+C to stop both services
    echo.
    start cmd /k "npm run backend:dev"
    npm run dev
    goto end
)

if "%1"=="backend" (
    echo Starting Django backend...
    echo Backend: http://localhost:8000
    npm run backend:dev
    goto end
)

if "%1"=="frontend" (
    echo Starting React frontend...
    echo Frontend: http://localhost:5173
    npm run dev
    goto end
)

echo Usage:
echo   setup.bat install  - Install all dependencies
echo   setup.bat setup    - Setup database
echo   setup.bat dev      - Start both services
echo   setup.bat backend  - Start Django only
echo   setup.bat frontend - Start React only
echo.
echo Or use npm commands:
echo   npm run install:all    - Install all dependencies
echo   npm run backend:setup  - Setup database
echo   npm run dev:full      - Start both services
echo   npm run backend:dev   - Start Django only
echo   npm run dev           - Start React only

:end
