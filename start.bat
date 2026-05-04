@echo off
echo Starting Detail Deal...
echo ================================

echo Installing dependencies...
yarn install
yarn workspace backend install  
yarn workspace frontend install

echo Starting servers...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4200
echo ================================
echo Press Ctrl+C to stop
echo.

concurrently "yarn workspace backend start" "yarn workspace frontend dev"
