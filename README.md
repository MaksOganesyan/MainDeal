#  Deal - Онлайн-сервис по металлообработке

Main Deal - это полнофункциональное веб-приложение для заказа услуг металлообработки, где заказчики могут находить исполнителей, а исполнители предлагать свои услуги.

## 🚀 Обзор проекта

- **Фронтенд:** React + TypeScript + Vite + Material-UI + TailwindCSS
- **Бэкенд:** Node.js + Express + SQLite
- **Аутентификация:** JWT токены с cookies
- **База данных:** SQLite
- **Пакетный менеджер:** Yarn (workspaces)

## 📋 Функциональность

### Для заказчиков:
- 🔍 Поиск исполнителей по услугам металлообработки
- 📝 Создание заказов и объявлений
- 💬 Чат с исполнителями
- 📊 Просмотр истории сделок
- ⭐ Оценка исполнителей

### Для исполнителей:
- 📋 Просмотр доступных заказов
- 💰 Расчет стоимости работ
- 📝 Отклики на заказы
- 💬 Общение с заказчиками
- 📈 Управление профилем и портфолио

### Для менеджеров:
- 👥 Управление пользователями
- 📊 Аналитика и статистика
- 🛡️ Модерация контента
- 💬 Поддержка пользователей

## 🛠️ Требования

- **Node.js:** 18.x или выше
- **Yarn:** 1.22.x или выше
- **Git:** для клонирования репозитория

## 📦 Установка и запуск

### Клонирование репозитория

```bash
git clone https://github.com/MaksOganesyan/MainDeal.git
cd MainDeal
```

### Установка зависимостей

#### Автоматическая установка (рекомендуется)

**Windows:**
```bash
# Запуск через bat-файл
start.bat

# Или через yarn
yarn start
```

**macOS/Linux:**
```bash
# Запуск через shell-скрипт
chmod +x start.sh
./start.sh

# Или через yarn
yarn start
```

#### Ручная установка

```bash
# Установка корневых зависимостей
yarn install

# Установка зависимостей бэкенда
yarn workspace backend install

# Установка зависимостей фронтенда
yarn workspace frontend install
```

### Запуск приложения

#### Способ 1: Через скрипты (рекомендуется)

**Windows:**
```bash
yarn start
# или
start.bat
```

**macOS/Linux:**
```bash
yarn start
# или
./start.sh
```

#### Способ 2: Вручную

```bash
# Запуск бэкенда и фронтенда одновременно
yarn concurrently "yarn workspace backend start" "yarn workspace frontend dev"

# Или в разных терминалах:
# Терминал 1 - Бэкенд
yarn workspace backend start

# Терминал 2 - Фронтенд
yarn workspace frontend dev
```

#### Способ 3: Отдельные команды

**Запуск только бэкенда:**
```bash
yarn workspace backend start
# Сервер будет доступен на http://localhost:4200
```

**Запуск только фронтенда:**
```bash
yarn workspace frontend dev
# Приложение будет доступно на http://localhost:5173
```

**Запуск фронтенда с доступом из сети:**
```bash
yarn workspace frontend dev --host
# Приложение будет доступно по IP адресу в локальной сети
```

## 🌐 Доступ к приложению

После запуска:

- **Фронтенд:** http://localhost:5173
- **Бэкенд API:** http://localhost:4200
- **API эндпоинты:**
  - `POST /api/auth/register` - Регистрация
  - `POST /api/auth/login` - Вход
  - `GET /api/auth/me` - Текущий пользователь
  - `POST /api/auth/logout` - Выход

## 🏗️ Структура проекта

```
MainDeal/
├── backend/                 # Бэкенд приложение
│   ├── server.js           # Главный файл сервера
│   ├── database.sqlite     # База данных SQLite
│   ├── package.json        # Зависимости бэкенда
│   └── src/                # Исходный код бэкенда
│       ├── routes/         # API маршруты
│       ├── middleware/     # Middleware
│       ├── models/         # Модели данных
│       └── utils/          # Утилиты
├── frontend/               # Фронтенд приложение
│   ├── src/               # Исходный код React
│   │   ├── components/    # Компоненты
│   │   ├── pages/         # Страницы
│   │   ├── services/      # API сервисы
│   │   ├── types/         # TypeScript типы
│   │   ├── hooks/         # React хуки
│   │   └── utils/         # Утилиты
│   ├── public/            # Статические файлы
│   ├── package.json       # Зависимости фронтенда
│   └── vite.config.ts     # Конфигурация Vite
├── package.json           # Корневые зависимости и скрипты
├── start.bat              # Скрипт запуска для Windows
├── start.sh               # Скрипт запуска для macOS/Linux
└── README.md              # Этот файл
```

## 🔧 Разработка

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Бэкенд
PORT=4200
NODE_ENV=development
JWT_SECRET=your-secret-key-here

# Фронтенд
VITE_API_URL=http://localhost:4200
```

### Линтинг и форматирование

```bash
# Линтинг фронтенда
yarn workspace frontend lint

# Сборка фронтенда
yarn workspace frontend build

# Предпросмотр сборки
yarn workspace frontend preview
```

### Работа с базой данных

База данных SQLite создается автоматически при первом запуске бэкенда. Файл базы данных: `backend/database.sqlite`

Для сброса базы данных:

```bash
# Остановить бэкенд
rm backend/database.sqlite
# Перезапустить бэкенд - база создастся заново
```

## 🚀 Деплой

### Production сборка

```bash
# Сборка фронтенда
yarn workspace frontend build

# Запуск в production режиме
NODE_ENV=production yarn workspace backend start
```

### Docker (опционально)

```dockerfile
# Пример Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn workspace frontend build

EXPOSE 4200
CMD ["yarn", "workspace", "backend", "start"]
```

### Деплой на хостинг

1. **Vercel (фронтенд):**
   ```bash
   npm i -g vercel
   cd frontend
   vercel --prod
   ```

2. **Heroku (полный стек):**
   ```bash
   # Создать Procfile
   echo "web: node backend/server.js" > Procfile
   heroku create your-app-name
   git push heroku main
   ```

3. **Ручной деплой:**
   - Собрать фронтенд: `yarn workspace frontend build`
   - Загрузить файлы на сервер
   - Установить зависимости: `yarn install`
   - Запустить бэкенд: `NODE_ENV=production yarn workspace backend start`

## � Как отправлять изменения на хостинг

### Способ 1: Автоматический деплой через Git (рекомендуется)

**Для Vercel (фронтенд):**
```bash
# Установка Vercel CLI
npm i -g vercel

# Первоначальная настройка
cd frontend
vercel --prod

# Последующие деплои (автоматически при пуше в main)
git add .
git commit -m "Update production"
git push origin main
```

**Для Heroku (полный стек):**
```bash
# Создание приложения
heroku create your-app-name

# Настройка переменных окружения
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret

# Деплой
git add .
git commit -m "Deploy to production"
git push heroku main
```

### Способ 2: Ручной деплой на VPS/сервер

**Подготовка к деплою:**
```bash
# 1. Сборка фронтенда
yarn workspace frontend build

# 2. Коммит изменений
git add .
git commit -m "Ready for deployment"
git push origin main
```

**На сервере:**
```bash
# 1. Подключиться к серверу
ssh user@your-server-ip

# 2. Перейти в директорию проекта
cd /var/www/your-project

# 3. Загрузить последние изменения
git pull origin main

# 4. Установить новые зависимости
yarn install

# 5. Собрать фронтенд
yarn workspace frontend build

# 6. Перезапустить бэкенд
pm2 restart backend
# или
systemctl restart your-app
```

### Способ 3: Деплой через FTP/SFTP

**Локальная подготовка:**
```bash
# 1. Сборка проекта
yarn workspace frontend build

# 2. Создание архива
tar -czf deploy.tar.gz --exclude=node_modules --exclude=.git .
```

**Загрузка на сервер:**
```bash
# Через SFTP
sftp user@your-server-ip
put deploy.tar.gz /var/www/your-project/
exit

# На сервере
ssh user@your-server-ip
cd /var/www/your-project
tar -xzf deploy.tar.gz
yarn install
yarn workspace frontend build
pm2 restart backend
```

### 📋 Скрипт автоматического деплоя

**Создайте `deploy.sh`:**
```bash
#!/bin/bash
echo "🚀 Starting deployment..."

# Сборка фронтенда
echo "📦 Building frontend..."
yarn workspace frontend build

# Коммит изменений
echo "📝 Committing changes..."
git add .
git commit -m "Auto-deploy: $(date)"
git push origin main

# Деплой на сервер (если настроен)
echo "🌐 Deploying to server..."
# ssh user@server 'cd /var/www/project && git pull && yarn install && yarn workspace frontend build && pm2 restart backend'

echo "✅ Deployment complete!"
```

### 🔄 CI/CD автоматизация

**GitHub Actions (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: yarn install
      
    - name: Build frontend
      run: yarn workspace frontend build
      
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.4
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/project
          git pull origin main
          yarn install
          yarn workspace frontend build
          pm2 restart backend
```

### 🎯 Быстрый деплой (One-command)

**Добавьте в `package.json`:**
```json
{
  "scripts": {
    "deploy": "yarn workspace frontend build && git add . && git commit -m 'Deploy' && git push origin main"
  }
}
```

**Использование:**
```bash
yarn deploy
```

### 📊 Мониторинг деплоя

**Проверка статуса:**
```bash
# Проверить статус сервера
pm2 status

# Просмотр логов
pm2 logs backend

# Проверить работу API
curl http://your-domain.com/api/auth/me
```

## �🐛 Устранение проблем

### Частые проблемы

1. **Ошибка "yarn command not found"**
   ```bash
   # Установить yarn
   npm install -g yarn
   ```

2. **Ошибка "port already in use"**
   ```bash
   # Найти процесс на порту
   netstat -ano | findstr :4200
   # Убить процесс
   taskkill /PID <PID> /F
   ```

3. **Ошибка с зависимостями**
   ```bash
   # Очистить кэш yarn
   yarn cache clean
   # Переустановить зависимости
   rm -rf node_modules
   yarn install
   ```

4. **Проблемы с доступом по сети**
   ```bash
   # Запустить фронтенд с хостом
   yarn workspace frontend dev --host
   # Проверить брандмауэр
   ```

### Логирование

- **Бэкенд логи:** Консоль при запуске сервера
- **Фронтенд логи:** Вкладка Network в браузере
- **База данных:** `backend/database.sqlite`

## 🤝 Участие в разработке

1. Форкнуть репозиторий
2. Создать ветку: `git checkout -b feature/new-feature`
3. Внести изменения
4. Закоммитить: `git commit -m 'Add new feature'`
5. Запушить: `git push origin feature/new-feature`
6. Создать Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License.

## 📞 Контакты

- **GitHub:** https://github.com/MaksOganesyan/MainDeal
- **Issues:** https://github.com/MaksOganesyan/MainDeal/issues

---

## 🎯 Быстрый старт для новичков

1. **Клонировать и зайти в папку:**
   ```bash
   git clone https://github.com/MaksOganesyan/MainDeal.git
   cd MainDeal
   ```

2. **Запустить (Windows):**
   ```bash
   start.bat
   ```

3. **Открыть в браузере:**
   - http://localhost:5173 - фронтенд
   - http://localhost:4200 - API

4. **Готово!** Приложение работает 🎉

---

**Примечание:** При первом запуске может занять несколько минут для установки всех зависимостей.
