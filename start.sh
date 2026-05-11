#!/bin/bash

# MAIN DEAL - Онлайн-сервис по металлообработке
# Скрипт для установки и запуска проекта

echo "🚀 Запускаем MAIN DEAL..."
echo "================================"

# Проверяем наличие yarn
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn не найден. Пожалуйста, установите Yarn:"
    echo "npm install -g yarn"
    exit 1
fi

# Установка зависимостей
echo "📦 Установка зависимостей..."
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки корневых зависимостей"
    exit 1
fi

echo "📦 Установка зависимостей бэкенда..."
yarn workspace backend install
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей бэкенда"
    exit 1
fi

echo "📦 Установка зависимостей фронтенда..."
yarn workspace frontend install
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей фронтенда"
    exit 1
fi

# Запуск серверов
echo "🚀 Запуск серверов..."
echo "📍 Фронтенд: http://localhost:5173"
echo "📍 Бэкенд:  http://localhost:4200"
echo "================================"
echo "Нажмите Ctrl+C для остановки"
echo ""

# Запускаем оба сервера одновременно
concurrently "yarn workspace backend start" "yarn workspace frontend dev"
