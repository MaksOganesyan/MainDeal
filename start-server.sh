#!/bin/bash

# Detail Deal - Скрипт для запуска на сервере
# Запуск приложения на порту 5175

echo "🚀 Запускаем Detail Deal на сервере..."
echo "================================"

# Проверяем наличие yarn
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn не найден. Пожалуйста, установите Yarn:"
    echo "npm install -g yarn"
    exit 1
fi

# Установка зависимостей
echo "📦 Установка зависимостей..."
yarn install --production=false
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки корневых зависимостей"
    exit 1
fi

yarn workspace backend install --production=false
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей бэкенда"
    exit 1
fi

yarn workspace frontend install --production=false
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки зависимостей фронтенда"
    exit 1
fi

# Сборка фронтенда
echo "🏗️ Сборка фронтенда..."
yarn workspace frontend build
if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки фронтенда"
    exit 1
fi

# Сборка бэкенда (TypeScript)
echo "🏗️ Сборка бэкенда..."
cd backend
if [ -f "tsconfig.json" ]; then
    npx tsc
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка сборки TypeScript бэкенда"
        exit 1
    fi
fi
cd ..

# Создание .env файла для сервера
if [ ! -f ".env" ]; then
    echo "📝 Создание .env для сервера..."
    cat > .env << EOF
NODE_ENV=production
PORT=5175
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=true
EOF
fi

# Запуск сервера
echo "🚀 Запуск сервера..."
echo "📍 Адрес: http://localhost:5175"
echo "================================"
echo "Нажмите Ctrl+C для остановки"
echo ""

# Запускаем сервер в продакшен режиме
cd backend && PORT=5175 npm start
