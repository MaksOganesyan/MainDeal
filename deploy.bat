@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: Detail Deal - Скрипт для деплоя проекта (Windows)
:: Используется для командной работы и продакшена

echo 🚀 Деплоим Detail Deal...
echo ================================

:: Проверяем наличие yarn
yarn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Yarn не найден. Пожалуйста, установите Yarn:
    echo npm install -g yarn
    pause
    exit /b 1
)

:: Очистка предыдущих сборок
echo 🧹 Очистка предыдущих сборок...
if exist frontend\dist rmdir /s /q frontend\dist
if exist backend\dist rmdir /s /q backend\dist

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
call yarn workspace frontend build
if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки фронтенда
    pause
    exit /b 1
)

:: Сборка бэкенда (TypeScript)
echo 🏗️ Сборка бэкенда...
if exist backend\tsconfig.json (
    cd backend
    call npx tsc
    if %errorlevel% neq 0 (
        echo ❌ Ошибка сборки TypeScript бэкенда
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

:: Копирование файлов для продакшена
echo 📋 Подготовка продакшен файлов...
if not exist dist mkdir dist
xcopy /e /y /i backend\dist\* dist\ >nul 2>&1 || echo ⚠️ Бэкенд не собран в dist
xcopy /e /y /i frontend\dist\* dist\ >nul 2>&1 || echo ⚠️ Фронтенд не собран в dist

:: Создание .env файла для продакшена
if not exist dist\.env (
    echo 📝 Создание .env для продакшена...
    (
        echo NODE_ENV=production
        echo PORT=4200
        echo DATABASE_PATH=./database.sqlite
        echo CORS_ORIGIN=true
    ) > dist\.env
)

:: Создание package.json для продакшена
echo 📝 Создание package.json для продакшена...
(
    echo {
    echo     "name": "detail-deal-production",
    echo     "version": "1.0.0",
    echo     "main": "server.js",
    echo     "scripts": {
    echo         "start": "node server.js"
    echo     },
    echo     "dependencies": {
    echo         "express": "^4.18.2",
    echo         "cors": "^2.8.5",
    echo         "cookie-parser": "^1.4.6",
    echo         "argon2": "^0.31.1",
    echo         "sqlite3": "^5.1.6"
    echo     },
    echo     "engines": {
    echo         "node": ">=18.0.0"
    echo     }
    echo }
) > dist\package.json

echo ✅ Деплой завершен успешно!
echo ================================
echo 📁 Готовые файлы в папке: .\dist
echo 🚀 Для запуска в продакшене:
echo    cd dist ^&^& npm install ^&^& npm start
echo.
echo 🌐 Переменные окружения:
echo    NODE_ENV=production
echo    PORT=4200
echo    DATABASE_PATH=./database.sqlite
echo.

:: Проверка размера сборки
echo 📊 Размер сборки:
for /f "tokens=3" %%a in ('dir /s dist\ 2^>nul ^| findstr "File(s)"') do echo    %%a

echo ================================
echo 🎉 Проект готов к деплою!

pause
