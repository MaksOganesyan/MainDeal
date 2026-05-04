#!/bin/bash

# Detail Deal - Скрипт для деплоя проекта
# Используется для командной работы и продакшена

echo "🚀 Деплоим Detail Deal..."
echo "================================"

# Проверяем наличие yarn
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn не найден. Пожалуйста, установите Yarn:"
    echo "npm install -g yarn"
    exit 1
fi

# Очистка предыдущих сборок
echo "🧹 Очистка предыдущих сборок..."
rm -rf frontend/dist
rm -rf backend/dist

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
NODE_OPTIONS="--max-old-space-size=4096" yarn workspace frontend build
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

# Копирование файлов для продакшена
echo "📋 Подготовка продакшен файлов..."
mkdir -p dist
cp -r backend/dist/* dist/ 2>/dev/null || echo "⚠️ Бэкенд не собран в dist"
cp -r frontend/dist/* dist/ 2>/dev/null || echo "⚠️ Фронтенд не собран в dist"

# Создание .env файла для продакшена
if [ ! -f "dist/.env" ]; then
    echo "📝 Создание .env для продакшена..."
    cat > dist/.env << EOF
NODE_ENV=production
PORT=4200
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=true
EOF
fi

# Создание package.json для продакшена
echo "📝 Создание package.json для продакшена..."
cat > dist/package.json << EOF
{
    "name": "detail-deal-production",
    "version": "1.0.0",
    "main": "server.js",
    "scripts": {
        "start": "node server.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "cookie-parser": "^1.4.6",
        "argon2": "^0.31.1",
        "sqlite3": "^5.1.6"
    },
    "engines": {
        "node": ">=18.0.0"
    }
}
EOF

echo "✅ Деплой завершен успешно!"
echo "================================"
echo "📁 Готовые файлы в папке: ./dist"
echo "🚀 Для запуска в продакшене:"
echo "   cd dist && npm install && npm start"
echo ""
echo "🌐 Переменные окружения:"
echo "   NODE_ENV=production"
echo "   PORT=4200"
echo "   DATABASE_PATH=./database.sqlite"
echo ""

# Проверка размера сборки
echo "📊 Размер сборки:"
du -sh dist/ 2>/dev/null || echo "⚠️ Не удалось определить размер"

echo "================================"
echo "🎉 Проект готов к деплою!"
