@echo off
chcp 65001 >nul

:: MAIN DEAL - Онлайн-сервис по металлообработке
:: Скрипт для установки и запуска проекта (Windows)

echo 🚀 Запускаем MAIN DEAL...
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
call yarn install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки корневых зависимостей
    pause
    exit /b 1
)

echo 📦 Установка зависимостей бэкенда...
call yarn workspace backend install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей бэкенда
    pause
    exit /b 1
)

echo 📦 Установка зависимостей фронтенда...
call yarn workspace frontend install
if %errorlevel% neq 0 (
    echo ❌ Ошибка установки зависимостей фронтенда
    pause
    exit /b 1
)

:: Запуск серверов
echo 🚀 Запуск серверов...
echo 📍 Фронтенд: http://localhost:5173
echo 📍 Бэкенд:  http://localhost:4200
echo ================================
echo Нажмите Ctrl+C для остановки
echo.

:: Запускаем оба сервера одновременно
call concurrently "yarn workspace backend start" "yarn workspace frontend dev"

pause
