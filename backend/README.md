---
### README для backend (`backend/README.md`)
---

# Detail Deal – Backend (NestJS + Prisma)

Бекенд часть платформы **Detail Deal** построена на **NestJS** и использует **Prisma** для работы с базой данных.  
Отвечает за аутентификацию, управление пользователями и ролями, объявлениями, заказами, чатами, жалобами и прочей бизнес‑логикой.

---

## Технологический стек

- **NestJS 10** – каркас приложения
- **TypeScript**
- **Prisma 5** – ORM, миграции и доступ к БД
- **MySQL** – база данных (через MySQL Workbench)
- **JWT** (`@nestjs/jwt`, `passport-jwt`) – access / refresh токены
- **class-validator / class-transformer** – валидация DTO
- **argon2** – хеширование паролей
- **Multer** – загрузка файлов
- **Jest** – тестирование

---

## Требования

- **Node.js**: рекомендовано LTS (>= 18)
- **yarn** – пакетный менеджер (ТОЛЬКО yarn)
- **База данных**: MySQL – управляется через MySQL Workbench
- **XAMPP** – для запуска MySQL сервера в режиме администратора
- Настроенный `.env` с параметрами БД, JWT‑секретами и портом сервера

---

## Быстрый старт

1. Клонировать репозиторий backend:

   ```bash
   git clone <URL_БЭКЕНД_РЕПОЗИТОРИЯ> detail-deal-backend
   cd detail-deal-backend
   ```

2. Установить зависимости:

   ```bash
   yarn install
   ```

3. Настроить базу данных MySQL:
   
   **Запустить MySQL через XAMPP:**
   - Откройте XAMPP Control Panel
   - Запустите MySQL в режиме администратора
   - Откройте MySQL Workbench для управления БД

   **Создать базу данных:**
   ```sql
   CREATE DATABASE detail_deal;
   ```

4. Создать файл окружения `.env` на основе `.env.example`:
   
   ```bash
   # Порт сервера
   PORT=4200

   # Префикс для API
   API_PREFIX=/api

   # База данных (MySQL)
   DATABASE_URL="mysql://user:password@localhost:3306/detail_deal"

   # JWT
   JWT_SECRET=supersecret_access_key
   JWT_REFRESH_SECRET=supersecret_refresh_key
   ```

5. Применить миграции Prisma и сгенерировать клиент:

   ```bash
   # Создать/обновить структуру БД
   yarn db:migrate

   # Сгенерировать Prisma client (ОБЯЗАТЕЛЬНО для отображения в СУБД)
   yarn db:generate

   # (опционально) Загрузить тестовые данные
   yarn db:seed
   ```

   **Важно:** После запуска `yarn db:generate` изменения отобразятся в MySQL Workbench

6. Запустить приложение в режиме разработки:

   ```bash
   yarn start:dev
   ```

По умолчанию сервер будет доступен на `http://localhost:4200`, а API – на `http://localhost:4200/api`

---

## NPM‑скрипты

Основные скрипты из `package.json`:

- **`yarn start`** – запуск NestJS в prod‑режиме (из `dist`).
- **`yarn start:dev`** – запуск в dev‑режиме с `--watch`.
- **`yarn start:debug`** – dev‑режим с отладкой.
- **`yarn build`** – компиляция TypeScript в `dist`.
- **`yarn lint`** – ESLint для `src`, `apps`, `libs`, `test`.
- **`yarn test`**, `test:watch`, `test:cov`, `test:e2e` – запуск тестов (Jest).
- **`yarn db:migrate`** – `prisma migrate dev`.
- **`yarn db:generate`** – `prisma generate`.
- **`yarn db:seed`** – запуск `prisma/seed.ts`.
- **`yarn db:reset`** – `prisma migrate reset`.
- **`yarn db:studio`** – Prisma Studio.

---

## Структура проекта

Высокоуровнево (основное):

```text
backend/
  src/
    auth/             # аутентификация, JWT, refresh‑токены
      dto/            # DTO для логина/регистрации
      guards/         # jwt.guard, roles.guard
      strategies/     # jwt.strategy
      decorators/     # @Auth, @User, @Roles
      auth.controller.ts
      auth.service.ts
      refresh-token.service.ts
    user/             # пользователи, их профили и роли
      dto/
      user.controller.ts
      user.service.ts
      user.module.ts
    profiles/         # профили исполнителей/заказчиков
    deals/            # заказы / сделки
    deal-responses/   # отклики на заказы
    announcements/    # объявления
    complaints/       # жалобы
    equipment/        # оборудование
    chat/             # чаты, комнаты, сообщения
    notifications/    # нотификации
    manager/          # раздел для менеджеров/админов
    upload/           # загрузка файлов
    health/           # healthcheck
    filters/          # глобальные фильтры ошибок
    config/           # конфигурация JWT, загрузки, и т.п.
    utils/            # вспомогательные сервисы
    main.ts           # точка входа NestJS
    app.module.ts     # корневой модуль
  prisma/
    schema.prisma     # схема БД
    seed.ts           # сидер данных (если настроен)
  test/
    app.e2e-spec.ts   # e2e‑тесты
  ...
```

Дополнительно в корне есть файлы‑обзоры:

- `RELIABILITY_SUMMARY.md`
- `RELIABILITY_GUIDE.md`
- `DEAL_RESPONSES_GUIDE.md`
- `BUSINESS_LOGIC_SUMMARY.md`

Они полезны для понимания бизнес‑логики и требований по надёжности.

---

## Аутентификация и авторизация

### DTO и валидация

```ts
// src/auth/dto/auth.dto.ts
import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  Validate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PasswordValidator } from '../validators/password.validator';
import { userrole_role } from '@prisma/client';

export class AuthDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  login?: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password must contain both uppercase and lowercase letters',
  })
  @Validate(PasswordValidator)
  password: string;

  @IsEnum(userrole_role, { message: 'Invalid role' })
  @IsOptional()
  role?: userrole_role;
}
```

- Пароль:
  - 5–20 символов,
  - обязательно и строчные, и заглавные буквы,
  - дополнительная проверка через `PasswordValidator`.

При нарушении правил `class-validator` возвращает `400 Bad Request` с описанием ошибок.

`RegisterDto` расширяет `AuthDto`, добавляя `fullName`, `phone` и опциональную `role`.

---

### Контроллер авторизации

Ключевые маршруты (`src/auth/auth.controller.ts` — кратко):

```ts
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);
    return response; // user + accessToken
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register-executor')
  async registerExecutor(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.registerExecutor(dto);
    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.refreshTokenService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token not passed');
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );

    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenService.removeRefreshTokenFromResponse(res);
    return true;
  }

  @Auth([userrole_role.CUSTOMER, userrole_role.EXECUTOR, userrole_role.MANAGER, userrole_role.ADMIN])
  @HttpCode(200)
  @Post('me')
  async getCurrentUser(@Req() req: Request) {
    return req.user;
  }
}
```

- **`POST /auth/login`** – логин, возвращает пользователя и токены, refresh уходит в куку.
- **`POST /auth/register`** – регистрация нового пользователя (по умолчанию с ролью `CUSTOMER`).
- **`POST /auth/register-executor`** – регистрация исполнителя, только для MANAGER/ADMIN.
- **`POST /auth/access-token`** – выдача новой пары access/refresh по refresh‑токену.
- **`POST /auth/logout`** – удаление refresh‑токена.
- **`POST /auth/me`** – возврат текущего пользователя, защищён ролями.

---

### AuthService (логика регистрации и входа)

`src/auth/auth.service.ts` (важные моменты):

- **`login(dto: AuthDto)`**:
  - через `validateUser` ищет пользователя по `email` (и опционально `login`),
  - сравнивает пароль через `argon2.verify`,
  - возвращает `{ user, accessToken, refreshToken }`.

- **`register(dto: AuthDto | RegisterDto)`**:
  - проверяет, что `email` не занят;
  - генерирует `login`, если не передан (из части email до `@`);
  - проверяет уникальность `login` (и при конфликте использует полный email);
  - валидирует DTO через `class-validator`;
  - хеширует пароль (`hash(dto.password)` из `argon2`);
  - создаёт запись пользователя в Prisma с ролями (`userrole_role.CUSTOMER` по умолчанию);
  - возвращает `{ user, accessToken, refreshToken }`.

- **`registerExecutor(dto: AuthDto)`**:
  - вызывает `register` с принудительной ролью `userrole_role.EXECUTOR`.

- **`getNewTokens(refreshToken: string)`**:
  - проверяет refresh‑токен через `jwt.verifyAsync`,
  - ищет пользователя через `UserService`,
  - выдаёт новую пару токенов.

- **`issueTokens(userId, roles)`**:
  - формирует payload `{ id, roles }`,
  - создаёт:
    - access‑токен с TTL `1h`,
    - refresh‑токен с TTL `7d`.

- **`omitPassword`**:
  - удаляет поле `password` перед возвратом пользователя наружу.

---

## Роли и защищённые маршруты

Роли (`@prisma/client: userrole_role`):

- `CUSTOMER`
- `EXECUTOR`
- `MANAGER`
- `ADMIN`

Они хранятся в массиве `userrole` у пользователя и попадают в JWT.  

Декоратор `@Auth([...Roles])`:

- подключает JWT‑guard (проверка токена),
- Role‑guard (проверка, что у пользователя хотя бы одна из требуемых ролей).

Пример:

```ts
@Auth([userrole_role.MANAGER, userrole_role.ADMIN])
@Get('protected')
getManagerData() {
  return 'only for managers/admins';
}
```

Эта же информация о ролях используется на фронте для выбора дашборда и отображения пунктов меню.

---

## Интеграция с frontend

Чтобы фронтенд и бэкенд из разных репозиториев корректно работали вместе:

1. **Единый URL API**

   - Backend слушает, например, `http://localhost:4200`.
   - В `main.ts` установлен префикс `api`, поэтому базовый URL API:
     `http://localhost:4200/api`.

2. **Конфигурация на frontend**

   В `.env.local` фронта:

   ```bash
   VITE_API_URL=http://localhost:4200/api
   VITE_NODE_ENV=development
   ```

3. **CORS**

   В `main.ts` включить CORS:

   ```ts
   app.enableCors({
     origin: ['http://localhost:3000'], // адрес фронтенда
     credentials: true,
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
     allowedHeaders: 'Content-Type, Authorization',
   });
   ```

4. **Токены**

   - Backend ставит refresh‑токен в HttpOnly‑куку (через `RefreshTokenService`).
   - Frontend хранит access‑токен в своей куке (`js-cookie`) и добавляет его в заголовок `Authorization`.
   - Защищённые маршруты (например, `GET /users/profile`) требуют `Bearer <accessToken>`.

---

## Типичный сценарий для разработчика

1. Запустить MySQL через XAMPP Control Panel.
2. Открыть MySQL Workbench и создать базу данных `detail_deal`.
3. Настроить `.env`, выполнить `yarn db:migrate` и `yarn db:generate`.
4. Запустить `yarn start:dev`.
5. Поднять фронтенд и пройти поток регистрации/входа.
6. Через Prisma Studio (`yarn db:studio`) убедиться, что пользователи создаются, роли присваиваются корректно.
7. Изучить модули:
   - `auth` – вход/регистрация/tokens,
   - `user` – профиль,
   - `deals`, `announcements`, `chat`, `manager` – доменная логика.

---
