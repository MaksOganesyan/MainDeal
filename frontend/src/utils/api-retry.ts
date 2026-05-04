/**
 * Утилиты для надежных API запросов с retry логикой
 */

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoff?: boolean;
  retryOn?: number[]; // HTTP статусы для retry
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  backoff: true,
  retryOn: [408, 429, 500, 502, 503, 504] // Request Timeout, Too Many Requests, Server Errors
};

/**
 * Задержка выполнения
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Проверяет, нужно ли повторять запрос при данной ошибке
 */
const shouldRetry = (error: any, retryOn: number[]): boolean => {
  if (!error.response) {
    // Сетевая ошибка (нет интернета и т.д.) - повторяем
    return true;
  }

  const status = error.response.status;
  return retryOn.includes(status);
};

/**
 * Выполняет функцию с retry логикой
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= (opts.maxRetries || 0); attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Если это последняя попытка или ошибка не подлежит retry - пробрасываем
      if (attempt === opts.maxRetries || !shouldRetry(error, opts.retryOn || [])) {
        throw error;
      }

      // Вычисляем задержку (с exponential backoff если включено)
      const delayMs = opts.backoff
        ? (opts.retryDelay || 1000) * Math.pow(2, attempt)
        : (opts.retryDelay || 1000);

      console.warn(
        `API request failed (attempt ${attempt + 1}/${opts.maxRetries}). Retrying in ${delayMs}ms...`,
        error.message
      );

      await delay(delayMs);
    }
  }

  throw lastError;
}

/**
 * Обрабатывает ошибки API запросов и возвращает понятное сообщение
 */
export function handleApiError(error: any): string {
  // Нет ответа от сервера (сетевая ошибка)
  if (!error.response) {
    if (error.message === 'Network Error') {
      return 'Нет подключения к интернету. Проверьте соединение и попробуйте снова.';
    }
    return 'Не удалось подключиться к серверу. Попробуйте позже.';
  }

  const status = error.response.status;
  const data = error.response.data;

  // Сервер вернул ошибку с сообщением
  if (data && data.message) {
    return Array.isArray(data.message) ? data.message.join(', ') : data.message;
  }

  // Стандартные HTTP ошибки
  switch (status) {
    case 400:
      return 'Неверные данные. Проверьте заполнение полей.';
    case 401:
      return 'Необходима авторизация. Войдите в систему.';
    case 403:
      return 'Доступ запрещен. У вас нет прав на это действие.';
    case 404:
      return 'Запрашиваемый ресурс не найден.';
    case 408:
      return 'Время ожидания истекло. Попробуйте снова.';
    case 429:
      return 'Слишком много запросов. Подождите немного и попробуйте снова.';
    case 500:
      return 'Ошибка сервера. Мы уже работаем над исправлением.';
    case 502:
    case 503:
      return 'Сервер временно недоступен. Попробуйте через несколько минут.';
    case 504:
      return 'Сервер не отвечает. Попробуйте позже.';
    default:
      return `Произошла ошибка (${status}). Попробуйте снова.`;
  }
}

/**
 * Безопасное выполнение API запроса с fallback значением
 */
export async function safeApiCall<T>(
  fn: () => Promise<T>,
  fallbackValue: T,
  options?: RetryOptions
): Promise<T> {
  try {
    return await withRetry(fn, options);
  } catch (error) {
    console.error('API call failed, using fallback value:', error);
    return fallbackValue;
  }
}

/**
 * Кэширование результатов API запросов
 */
class ApiCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 минут по умолчанию

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Автоматическое удаление через TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl || this.ttl);
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Проверяем, не устарели ли данные
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();

/**
 * API запрос с кэшированием
 */
export async function cachedApiCall<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Проверяем кэш
  const cached = apiCache.get(key);
  if (cached !== null) {
    return cached;
  }

  // Выполняем запрос
  const result = await fn();
  
  // Сохраняем в кэш
  apiCache.set(key, result, ttl);
  
  return result;
}

/**
 * Debounce для API запросов
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle для API запросов
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Проверка доступности сервера
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch('/health', { method: 'GET' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

