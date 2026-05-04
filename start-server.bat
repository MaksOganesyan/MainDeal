@echo off
chcp 65001 >nul

:: Detail Deal - Скрипт для запуска на сервере (Windows)
:: Запуск приложения на порту 5175

echo 🚀 Запускаем Detail Deal на сервере...
echo ================================

:: Проверяем наличие yarn
yarn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Yarn не найден. Пожалуйста, установите Yarn:
    echo npm install -g yarn
    pause
    exit /b 1
)

:: Установка зависимостей
echo 📦 Установка зависимостей...
call yarn install --production=false
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки корневых зависимостей
    pause
    exit /b 1
)

call yarn workspace backend install --production=false
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей бэкенда
    pause
    exit /b 1
)

call yarn workspace frontend install --production=false
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей фронтенда
    pause
    exit /b 1
)

:: Сборка фронтенда
echo 🏗️ Сборка фронтенда...
set NODE_OPTIONS=--max-old-space-size=4096
call yarn workspace frontend build
if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки фронтенда
    pause
    exit /b 1
)

:: Запуск бэкенда без TypeScript компиляции
echo 🚀 Запуск бэкенда в продакшен режиме...

:: Создание .env файла для сервера
if not exist .env (
    echo 📝 Создание .env для сервера...
    (
        echo NODE_ENV=production
        echo PORT=5175
        echo DATABASE_PATH=./database.sqlite
        echo CORS_ORIGIN=true
    ) > .env
)

:: Запуск сервера
echo 🚀 Запуск сервера...
echo 📍 Адрес: http://localhost:5175
echo ================================
echo Нажмите Ctrl+C для остановки
echo.

:: Запускаем сервер в продакшен режиме
cd backend && set NODE_ENV=production && set PORT=5175 && npm start

pause
