const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4200;
const isProd = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 🔹 Подключение к SQLite базе
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Промисификация для sqlite3
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Создаём таблицы, если нет
async function initDB() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT,
      phone TEXT,
      avatar TEXT,
      address TEXT,
      region TEXT,
      registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      isActive BOOLEAN DEFAULT 1,
      lastOnline DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS userrole (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(userId, role)
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER UNIQUE NOT NULL,
      companyName TEXT,
      specializations TEXT,
      experience INTEGER,
      description TEXT,
      website TEXT,
      isPublic BOOLEAN DEFAULT 1,
      showContactInfo BOOLEAN DEFAULT 0,
      rating REAL DEFAULT 0,
      totalReviews INTEGER DEFAULT 0,
      completedDeals INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER NOT NULL,
      executorId INTEGER,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      materials TEXT,
      specifications TEXT,
      drawings TEXT,
      budget REAL,
      price REAL,
      currency TEXT DEFAULT 'RUB',
      deadline DATETIME,
      estimatedTime INTEGER,
      status TEXT DEFAULT 'ACTIVE',
      location TEXT,
      isUrgent BOOLEAN DEFAULT 0,
      attachments TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      completedAt DATETIME,
      FOREIGN KEY (customerId) REFERENCES users(id),
      FOREIGN KEY (executorId) REFERENCES users(id)
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      executorId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priceFrom REAL,
      priceTo REAL,
      currency TEXT DEFAULT 'RUB',
      estimatedDays INTEGER,
      region TEXT,
      location TEXT,
      images TEXT,
      attachments TEXT,
      isActive BOOLEAN DEFAULT 1,
      isUrgent BOOLEAN DEFAULT 0,
      isHidden BOOLEAN DEFAULT 0,
      views INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (executorId) REFERENCES users(id)
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS chat_rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dealId INTEGER UNIQUE,
      announcementId INTEGER UNIQUE,
      managerId INTEGER,
      isActive BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dealId) REFERENCES deals(id),
      FOREIGN KEY (announcementId) REFERENCES announcements(id),
      FOREIGN KEY (managerId) REFERENCES users(id)
    )
  `);
  
  await dbRun(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roomId INTEGER NOT NULL,
      authorId INTEGER NOT NULL,
      recipientId INTEGER,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'TEXT',
      attachments TEXT,
      isBlocked BOOLEAN DEFAULT 0,
      blockReason TEXT,
      isRead BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (roomId) REFERENCES chat_rooms(id),
      FOREIGN KEY (authorId) REFERENCES users(id),
      FOREIGN KEY (recipientId) REFERENCES users(id)
    )
  `);
  
  console.log('✅ Database initialized');
}

// Инициализация БД
initDB().catch(console.error);

// 🔹 Валидация пароля
function validatePassword(password) {
  if (!password || password.length < 5) {
    return { valid: false, message: 'Password must be at least 5 characters long' };
  }
  if (password.length > 20) {
    return { valid: false, message: 'Password must be at most 20 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
  }
  return { valid: true };
}

// 🔹 Валидация email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 🔹 Хелперы для работы с пользователями
async function getUserWithRoles(userId) {
  const user = await dbGet('SELECT id, login, email, fullName, phone, avatar, isActive, registeredAt FROM users WHERE id = ?', [userId]);
  if (!user) return null;
  
  const roles = await dbAll('SELECT role FROM userrole WHERE userId = ?', [userId]);
  user.userrole = roles.map(r => ({ role: r.role }));
  user.roles = roles.map(r => r.role);
  
  return user;
}

async function getUserByEmail(email) {
  return await dbGet('SELECT * FROM users WHERE email = ?', [email]);
}

async function getUserByLogin(login) {
  return await dbGet('SELECT * FROM users WHERE login = ?', [login]);
}

// 🔹 API маршруты - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
});

// 🔹 РЕГИСТРАЦИЯ - POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, login, password, role, fullName, phone } = req.body;
    
    // Валидация
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.valid) {
      return res.status(400).json({ message: pwdValidation.message });
    }
    
    // Проверка существующего пользователя
    const existingByEmail = await getUserByEmail(email);
    if (existingByEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const userLogin = login || email.split('@')[0];
    const existingByLogin = await getUserByLogin(userLogin);
    if (existingByLogin) {
      return res.status(400).json({ message: 'User with this login already exists' });
    }
    
    // Хеширование пароля
    const hashedPassword = await argon2.hash(password);
    
    // Создание пользователя
    const userResult = await dbRun(
      'INSERT INTO users (login, email, password, fullName, phone) VALUES (?, ?, ?, ?, ?)',
      [userLogin, email, hashedPassword, fullName || null, phone || null]
    );
    
    const userId = userResult.lastID;
    
    // Определение роли
    const userRole = role || 'CUSTOMER';
    const validRoles = ['CUSTOMER', 'EXECUTOR', 'MANAGER', 'ADMIN'];
    const finalRole = validRoles.includes(userRole.toUpperCase()) ? userRole.toUpperCase() : 'CUSTOMER';
    
    // Добавление роли
    await dbRun('INSERT INTO userrole (userId, role) VALUES (?, ?)', [userId, finalRole]);
    
    // Создание профиля
    await dbRun('INSERT INTO profiles (userId) VALUES (?)', [userId]);
    
    // Получение созданного пользователя
    const user = await getUserWithRoles(userId);
    
    // Установка cookie
    const userJson = encodeURIComponent(JSON.stringify(user));
    res.setHeader('Set-Cookie', `user=${userJson}; Path=/; HttpOnly=false; Secure=false; SameSite=Lax; Max-Age=86400`);
    
    res.status(200).json({ user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// 🔹 ВХОД - POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Поиск пользователя по email или login
    let user = await getUserByEmail(email);
    if (!user) {
      user = await getUserByLogin(email);
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Проверка пароля
    try {
      const isValid = await argon2.verify(user.password, password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Обновление lastOnline
    await dbRun('UPDATE users SET lastOnline = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    
    // Получение пользователя с ролями (без пароля)
    const userWithRoles = await getUserWithRoles(user.id);
    
    // Установка cookie
    const userJson = encodeURIComponent(JSON.stringify(userWithRoles));
    res.setHeader('Set-Cookie', `user=${userJson}; Path=/; HttpOnly=false; Secure=false; SameSite=Lax; Max-Age=86400`);
    
    res.status(200).json({ user: userWithRoles });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// 🔹 ВЫХОД - POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.json({ message: 'Logged out successfully' });
});

// 🔹 ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ - GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return res.json({ user: null });
  }
  
  const cookies = parseCookies(cookieHeader);
  const userCookie = cookies.user;
  
  if (!userCookie) {
    return res.json({ user: null });
  }
  
  try {
    const user = JSON.parse(decodeURIComponent(userCookie));
    return res.json({ user });
  } catch (error) {
    return res.json({ user: null });
  }
});

// 🔹 ОБЪЯВЛЕНИЯ - GET /api/announcements
app.get('/api/announcements', async (req, res) => {
  try {
    // Получаем реальные объявления из БД с информацией об исполнителях
    const announcements = await dbAll(`
      SELECT 
        a.*,
        u.id as executor_id,
        u.login as executor_login,
        u.fullName as executor_fullName,
        p.rating as executor_rating,
        p.completedDeals as executor_completedDeals
      FROM announcements a
      LEFT JOIN users u ON a.executorId = u.id
      LEFT JOIN profiles p ON u.id = p.userId
      WHERE a.isActive = 1 AND a.isHidden = 0
      ORDER BY a.createdAt DESC
    `);
    
    // Форматируем данные для фронтенда
    const formattedAnnouncements = announcements.map(announcement => ({
      id: announcement.id,
      executorId: announcement.executorId,
      title: announcement.title,
      description: announcement.description,
      category: announcement.category,
      priceFrom: announcement.priceFrom,
      priceTo: announcement.priceTo,
      currency: announcement.currency,
      estimatedDays: announcement.estimatedDays,
      region: announcement.region,
      location: announcement.location,
      images: announcement.images ? JSON.parse(announcement.images) : [],
      attachments: announcement.attachments ? JSON.parse(announcement.attachments) : [],
      isUrgent: !!announcement.isUrgent,
      status: 'ACTIVE',
      createdAt: announcement.createdAt,
      executor: {
        id: announcement.executor_id,
        login: announcement.executor_login,
        fullName: announcement.executor_fullName,
        rating: announcement.executor_rating || 0,
        completedDeals: announcement.executor_completedDeals || 0
      }
    }));
    
    res.json(formattedAnnouncements);
  } catch (err) {
    console.error('Failed to load announcements:', err);
    res.status(500).json({ message: 'Failed to load announcements' });
  }
});

// 🔹 МОИ ОБЪЯВЛЕНИЯ - GET /api/announcements/my
app.get('/api/announcements/my', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load my announcements' });
  }
});

// 🔹 СРОЧНЫЕ ОБЪЯВЛЕНИЯ - GET /api/announcements/urgent
app.get('/api/announcements/urgent', async (req, res) => {
  try {
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load urgent announcements' });
  }
});

// 🔹 ОБЪЯВЛЕНИЯ ПО КАТЕГОРИИ - GET /api/announcements/category/:category
app.get('/api/announcements/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load announcements by category' });
  }
});

// 🔹 ОБЪЯВЛЕНИЯ ПО РЕГИОНУ - GET /api/announcements/region/:region
app.get('/api/announcements/region/:region', async (req, res) => {
  try {
    const { region } = req.params;
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load announcements by region' });
  }
});

// 🔹 СОЗДАТЬ ОБЪЯВЛЕНИЕ - POST /api/announcements
app.post('/api/announcements', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { title, description, category, priceFrom, priceTo, estimatedDays, region, location, images, attachments } = req.body;
    
    // Проверяем, что пользователь является исполнителем
    const userRoles = await dbAll('SELECT role FROM userrole WHERE userId = ?', [user.id]);
    const isExecutor = userRoles.some(r => r.role === 'EXECUTOR');
    
    if (!isExecutor) {
      return res.status(403).json({ message: 'Only executors can create announcements' });
    }
    
    // Создаем объявление в БД
    const announcementResult = await dbRun(
      `INSERT INTO announcements (executorId, title, description, category, priceFrom, priceTo, estimatedDays, region, location, images, attachments) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        title,
        description,
        category,
        priceFrom || null,
        priceTo || null,
        estimatedDays || null,
        region || null,
        location || null,
        images ? JSON.stringify(images) : null,
        attachments ? JSON.stringify(attachments) : null
      ]
    );
    
    // Получаем созданное объявление с информацией об исполнителе
    const announcement = await dbGet(`
      SELECT 
        a.*,
        u.id as executor_id,
        u.login as executor_login,
        u.fullName as executor_fullName,
        p.rating as executor_rating,
        p.completedDeals as executor_completedDeals
      FROM announcements a
      LEFT JOIN users u ON a.executorId = u.id
      LEFT JOIN profiles p ON u.id = p.userId
      WHERE a.id = ?
    `, [announcementResult.lastID]);
    
    // Форматируем ответ
    const formattedAnnouncement = {
      id: announcement.id,
      executorId: announcement.executorId,
      title: announcement.title,
      description: announcement.description,
      category: announcement.category,
      priceFrom: announcement.priceFrom,
      priceTo: announcement.priceTo,
      currency: announcement.currency,
      estimatedDays: announcement.estimatedDays,
      region: announcement.region,
      location: announcement.location,
      images: announcement.images ? JSON.parse(announcement.images) : [],
      attachments: announcement.attachments ? JSON.parse(announcement.attachments) : [],
      isUrgent: !!announcement.isUrgent,
      status: 'ACTIVE',
      createdAt: announcement.createdAt,
      executor: {
        id: announcement.executor_id,
        login: announcement.executor_login,
        fullName: announcement.executor_fullName,
        rating: announcement.executor_rating || 0,
        completedDeals: announcement.executor_completedDeals || 0
      }
    };
    
    res.status(201).json(formattedAnnouncement);
  } catch (err) {
    console.error('Failed to create announcement:', err);
    res.status(500).json({ message: 'Failed to create announcement', error: err.message });
  }
});

// 🔹 ПОЛУЧИТЬ ОБЪЯВЛЕНИЕ - GET /api/announcements/:id
app.get('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Заглушка - возвращаем тестовое объявление
    const announcement = {
      id: parseInt(id),
      executorId: 1,
      title: 'Test Announcement',
      description: 'Test description',
      category: 'metalworking',
      priceFrom: 1000,
      priceTo: 5000,
      region: 'Moscow',
      location: 'Moscow',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load announcement' });
  }
});

// 🔹 Профиль пользователя - GET /api/profiles/me
app.get('/api/profiles/me', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    
    // Получаем профиль из БД
    const profile = await dbGet('SELECT * FROM profiles WHERE userId = ?', [user.id]);
    
    res.json({ ...profile, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
});

// 🔹 ЗАКАЗЫ - GET /api/deals
app.get('/api/deals', async (req, res) => {
  try {
    const { category } = req.query;
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load deals' });
  }
});

// 🔹 МОИ ЗАКАЗЫ - GET /api/deals/my
app.get('/api/deals/my', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load my deals' });
  }
});

// 🔹 ЗАКАЗЫ ИСПОЛНИТЕЛЯ - GET /api/deals/executor
app.get('/api/deals/executor', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Заглушка - возвращаем пустой массив
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load executor deals' });
  }
});

// 🔹 СОЗДАТЬ ЗАКАЗ - POST /api/deals
app.post('/api/deals', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { title, description, category, budget, deadline, location } = req.body;
    
    // Создаем заказ в БД
    const dealResult = await dbRun(
      'INSERT INTO deals (customerId, title, description, category, budget, deadline, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, title, description, category, budget || null, deadline || null, location || null, 'ACTIVE']
    );
    
    const deal = await dbGet('SELECT * FROM deals WHERE id = ?', [dealResult.lastID]);
    
    res.status(201).json(deal);
  } catch (err) {
    console.error('Create deal error:', err);
    res.status(500).json({ message: 'Failed to create deal', error: err.message });
  }
});

// 🔹 ПОЛУЧИТЬ ЗАКАЗ - GET /api/deals/:id
app.get('/api/deals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await dbGet('SELECT * FROM deals WHERE id = ?', [id]);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load deal' });
  }
});

// 🔹 ОБНОВИТЬ ЗАКАЗ - PATCH /api/deals/:id
app.patch('/api/deals/:id', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // Заглушка - возвращаем успех
    res.json({ id: parseInt(id), ...updates });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update deal' });
  }
});

// 🔹 НАЗНАЧИТЬ ИСПОЛНИТЕЛЯ - POST /api/deals/:id/assign-executor
app.post('/api/deals/:id/assign-executor', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { executorId, price } = req.body;
    
    // Заглушка - возвращаем успех
    res.json({ id: parseInt(id), executorId, price, status: 'IN_PROGRESS' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign executor' });
  }
});

// 🔹 ЗАВЕРШИТЬ ЗАКАЗ - POST /api/deals/:id/complete
app.post('/api/deals/:id/complete', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Заглушка - возвращаем успех
    res.json({ id: parseInt(id), status: 'COMPLETED' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete deal' });
  }
});

// 🔹 УДАЛИТЬ ЗАКАЗ - DELETE /api/deals/:id
app.delete('/api/deals/:id', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Заглушка - возвращаем успех
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete deal' });
  }
});

// 🔹 ИСТОРИЯ ЗАКАЗОВ КЛИЕНТА - GET /api/deals/history/customer
app.get('/api/deals/history/customer', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Заглушка - возвращаем пустую историю
    res.json({ deals: [], stats: { total: 0, active: 0, inProgress: 0, completed: 0, cancelled: 0, dispute: 0, averagePrice: 0 } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load customer history' });
  }
});

// 🔹 ИСТОРИЯ ЗАКАЗОВ ИСПОЛНИТЕЛЯ - GET /api/deals/history/executor
app.get('/api/deals/history/executor', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Заглушка - возвращаем пустую историю
    res.json({ deals: [], stats: { total: 0, active: 0, inProgress: 0, completed: 0, cancelled: 0, dispute: 0, averagePrice: 0 } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load executor history' });
  }
});

// 🔹 РАСЧЕТ ЦЕНЫ - POST /api/deals/calculate-price
app.post('/api/deals/calculate-price', async (req, res) => {
  try {
    const { category, complexity, materials, estimatedTime, isUrgent, location } = req.body;
    
    // Заглушка - простой расчет цены
    let basePrice = 1000;
    if (category === 'metalworking') basePrice = 2000;
    if (category === '3d_printing') basePrice = 1500;
    
    if (complexity === 'medium') basePrice *= 1.5;
    if (complexity === 'high') basePrice *= 2;
    
    if (isUrgent) basePrice *= 1.3;
    
    const result = {
      estimatedPrice: Math.round(basePrice),
      minPrice: Math.round(basePrice * 0.8),
      maxPrice: Math.round(basePrice * 1.5),
      marketAverage: Math.round(basePrice),
      calculatedBase: basePrice,
      breakdown: {
        basePrice,
        complexityMultiplier: complexity === 'medium' ? 1.5 : complexity === 'high' ? 2 : 1,
        materialsCount: materials?.length || 0,
        estimatedTime,
        isUrgent,
        samplesCount: 0
      }
    };
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate price' });
  }
});

// 🔹 Парсер cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length) {
      cookies[name] = rest.join('=');
    }
  });
  
  return cookies;
}

// 🔹 СОЗДАТЬ ЧАТ-КОМНАТУ - POST /api/chat/rooms
app.post('/api/chat/rooms', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { dealId, memberIds } = req.body;
    
    // Проверяем, существует ли сделка
    const deal = await dbGet('SELECT * FROM deals WHERE id = ?', [dealId]);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    // Проверяем, что пользователь является участником сделки
    if (deal.customerId !== user.id && deal.executorId !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Создаем чат-комнату
    const roomResult = await dbRun(
      'INSERT INTO chat_rooms (dealId, isActive) VALUES (?, ?)',
      [dealId, 1]
    );
    
    const room = await dbGet('SELECT * FROM chat_rooms WHERE id = ?', [roomResult.lastID]);
    
    res.status(201).json(room);
  } catch (err) {
    console.error('Failed to create chat room:', err);
    res.status(500).json({ message: 'Failed to create chat room', error: err.message });
  }
});

// 🔹 СОЗДАТЬ ЧАТ-КОМНАТУ ДЛЯ ОБЪЯВЛЕНИЯ - POST /api/chat/rooms/announcement/:announcementId
app.post('/api/chat/rooms/announcement/:announcementId', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { announcementId } = req.params;
    const { customerId } = req.body;
    
    // Проверяем, существует ли объявление
    const announcement = await dbGet('SELECT * FROM announcements WHERE id = ?', [announcementId]);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Проверяем, что пользователь является исполнителем объявления или заказчиком
    if (announcement.executorId !== user.id && customerId !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Проверяем, что комната еще не существует
    const existingRoom = await dbGet('SELECT * FROM chat_rooms WHERE announcementId = ?', [announcementId]);
    if (existingRoom) {
      return res.status(409).json({ message: 'Chat room already exists', room: existingRoom });
    }
    
    // Создаем чат-комнату
    const roomResult = await dbRun(
      'INSERT INTO chat_rooms (announcementId, isActive) VALUES (?, ?)',
      [announcementId, 1]
    );
    
    const room = await dbGet('SELECT * FROM chat_rooms WHERE id = ?', [roomResult.lastID]);
    
    res.status(201).json(room);
  } catch (err) {
    console.error('Failed to create chat room for announcement:', err);
    res.status(500).json({ message: 'Failed to create chat room', error: err.message });
  }
});

// 🔹 ПОЛУЧИТЬ ЧАТ-КОМНАТЫ - GET /api/chat/rooms
app.get('/api/chat/rooms', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    
    // Получаем чат-комнаты пользователя
    const rooms = await dbAll(`
      SELECT cr.*, 
             d.title as deal_title,
             a.title as announcement_title,
             d.customerId,
             d.executorId,
             a.executorId as announcement_executorId
      FROM chat_rooms cr
      LEFT JOIN deals d ON cr.dealId = d.id
      LEFT JOIN announcements a ON cr.announcementId = a.id
      WHERE (d.customerId = ? OR d.executorId = ? OR a.executorId = ?)
        AND cr.isActive = 1
    `, [user.id, user.id, user.id]);
    
    res.json(rooms);
  } catch (err) {
    console.error('Failed to load chat rooms:', err);
    res.status(500).json({ message: 'Failed to load chat rooms' });
  }
});

// 🔹 ПОЛУЧИТЬ ЧАТ-КОМНАТУ ПО ID - GET /api/chat/rooms/:id
app.get('/api/chat/rooms/:id', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { id } = req.params;
    
    const room = await dbGet(`
      SELECT cr.*, 
             d.title as deal_title,
             a.title as announcement_title,
             d.customerId,
             d.executorId,
             a.executorId as announcement_executorId
      FROM chat_rooms cr
      LEFT JOIN deals d ON cr.dealId = d.id
      LEFT JOIN announcements a ON cr.announcementId = a.id
      WHERE cr.id = ? AND cr.isActive = 1
    `, [id]);
    
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Проверяем, что пользователь имеет доступ к комнате
    if (room.customerId !== user.id && room.executorId !== user.id && room.announcement_executorId !== user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(room);
  } catch (err) {
    console.error('Failed to load chat room:', err);
    res.status(500).json({ message: 'Failed to load chat room' });
  }
});

// 🔹 СОЗДАТЬ СООБЩЕНИЕ - POST /api/chat/rooms/:roomId/messages
app.post('/api/chat/rooms/:roomId/messages', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { roomId } = req.params;
    const { content, type, attachments, recipientId } = req.body;
    
    // Проверяем, что комната существует и пользователь имеет доступ
    const room = await dbGet('SELECT * FROM chat_rooms WHERE id = ? AND isActive = 1', [roomId]);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Создаем сообщение
    const messageResult = await dbRun(
      `INSERT INTO chat_messages (roomId, authorId, recipientId, content, type, attachments) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roomId, user.id, recipientId || null, content, type || 'TEXT', attachments ? JSON.stringify(attachments) : null]
    );
    
    const message = await dbGet('SELECT * FROM chat_messages WHERE id = ?', [messageResult.lastID]);
    
    res.status(201).json(message);
  } catch (err) {
    console.error('Failed to create message:', err);
    res.status(500).json({ message: 'Failed to create message', error: err.message });
  }
});

// 🔹 ПОЛУЧИТЬ СООБЩЕНИЯ - GET /api/chat/rooms/:roomId/messages
app.get('/api/chat/rooms/:roomId/messages', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Проверяем, что комната существует и пользователь имеет доступ
    const room = await dbGet('SELECT * FROM chat_rooms WHERE id = ? AND isActive = 1', [roomId]);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    
    // Получаем сообщения
    const messages = await dbAll(`
      SELECT cm.*, u.login as author_login, u.fullName as author_fullName
      FROM chat_messages cm
      LEFT JOIN users u ON cm.authorId = u.id
      WHERE cm.roomId = ?
      ORDER BY cm.createdAt DESC
      LIMIT ? OFFSET ?
    `, [roomId, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);
    
    res.json(messages.reverse());
  } catch (err) {
    console.error('Failed to load messages:', err);
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

// 🔹 ПОЛУЧИТЬ КОЛИЧЕСТВО НЕПРОЧИТАННЫХ СООБЩЕНИЙ - GET /api/chat/unread-count
app.get('/api/chat/unread-count', async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const cookies = parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    
    // Получаем количество непрочитанных сообщений
    const unreadCount = await dbGet(`
      SELECT COUNT(*) as count
      FROM chat_messages cm
      JOIN chat_rooms cr ON cm.roomId = cr.id
      WHERE cr.isActive = 1 
        AND cm.authorId != ? 
        AND cm.isRead = 0
    `, [user.id]);
    
    res.json(unreadCount.count || 0);
  } catch (err) {
    console.error('Failed to load unread count:', err);
    res.status(500).json({ message: 'Failed to load unread count' });
  }
});

// 🔹 В production: раздаём собранный фронтенд
if (isProd) {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🗄️  SQLite: ${path.join(__dirname, 'database.sqlite')}`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST /api/auth/register - Registration`);
  console.log(`   POST /api/auth/login - Login`);
  console.log(`   POST /api/auth/logout - Logout`);
  console.log(`   GET  /api/auth/me - Current user`);
});
