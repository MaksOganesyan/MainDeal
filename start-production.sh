#!/bin/bash

# Скрипт для запуска приложения в production режиме с PM2

echo "🚀 Запускаем MAIN DEAL в production режиме..."
echo "================================"

# Проверяем установлен ли PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Устанавливаем PM2..."
    npm install -g pm2
fi

# Создаем директорию для логов
mkdir -p /home/makedetail-js/logs

# Останавливаем предыдущие процессы
echo "🛑 Останавливаем предыдущие процессы..."
pm2 delete makedetail-frontend makedetail-backend 2>/dev/null || true

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
yarn install

# Запускаем приложение через PM2
echo "🚀 Запускаем приложения через PM2..."
pm2 start pm2.config.js

# Сохраняем конфигурацию PM2
pm2 save

# Настраиваем автозапуск при старте системы
pm2 startup

echo "================================"
echo "✅ Приложение успешно запущено!"
echo ""
echo "📍 Статус процессов:"
pm2 status
echo ""
echo "📍 Логи:"
echo "  Фронтенд: pm2 logs makedetail-frontend"
echo "  Бэкенд:  pm2 logs makedetail-backend"
echo ""
echo "📍 Управление:"
echo "  Перезапуск: pm2 restart all"
echo "  Остановка:  pm2 stop all"
echo "  Мониторинг: pm2 monit"
echo ""
echo "🌐 Приложение доступно по адресу: https://js.makedetail.online"
