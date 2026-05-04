import { Injectable } from '@nestjs/common';

export interface ContentFilterResult {
  isBlocked: boolean;
  reason?: string;
  blockedPatterns?: string[];
}

@Injectable()
export class ContentFilterService {
  // Регулярные выражения для обнаружения контактной информации
  private readonly patterns = {
    // Телефонные номера в различных форматах
    phone: [
      /\+?[78][\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})/g, // +7 (xxx) xxx-xx-xx
      /\b\d{3}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}\b/g, // xxx-xxx-xx-xx
      /\b\d{11}\b/g, // 11 цифр подряд
      /\b\d{10}\b/g, // 10 цифр подряд
    ],
    
    // Email адреса
    email: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/g, // с пробелами
      /\b[A-Za-z0-9._%+-]+\s*\[\s*at\s*\]\s*[A-Za-z0-9.-]+\s*\[\s*dot\s*\]\s*[A-Z|a-z]{2,}\b/gi, // [at], [dot]
    ],
    
    // URL и ссылки
    url: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
      /\bwww\.[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
      /\b[a-zA-Z0-9-]+\.(?:com|ru|net|org|info|biz|online|site)\b/gi,
    ],
    
    // Мессенджеры
    messengers: [
      /\b(telegram|viber|whatsapp|skype|vk|vkontakte|instagram|facebook|fb)\b/gi,
      /\b@[a-zA-Z0-9_]{5,}\b/g, // telegram handles
      /\b(тг|телега|вайбер|вацап|скайп|инста)\b/gi, // русские варианты
    ],
    
    // Попытки обойти фильтр
    obfuscated: [
      /\b(\d[\s\.\-_]+){9,}\b/g, // числа с разделителями
      /\b([a-zA-Z0-9][\s\.\-_]+){10,}\b/g, // буквы/цифры с разделителями
      /\b(восемь|семь)\s*(девять|девять)\d{2}/gi, // "восемь девятьсот..."
    ],
    
    // Запрещенные фразы
    bannedPhrases: [
      /позвон[иі]/gi,
      /свяж[иі]сь/gi,
      /напиш[иі]/gi,
      /мой\s+(номер|телефон|email|почт|контакт)/gi,
      /личн[иоые]{1,3}\s+сообщ/gi,
      /обмен[яюи]{1,2}\s+контакт/gi,
      /перейд[иі].*?(личн|напрям)/gi,
    ]
  };

  /**
   * Проверяет текст на наличие запрещенного контента
   */
  checkContent(content: string): ContentFilterResult {
    const blockedPatterns: string[] = [];

    // Проверяем каждую категорию паттернов
    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          blockedPatterns.push(category);
          break; // Переходим к следующей категории
        }
      }
    }

    if (blockedPatterns.length > 0) {
      return {
        isBlocked: true,
        reason: this.getBlockReason(blockedPatterns),
        blockedPatterns
      };
    }

    return {
      isBlocked: false
    };
  }

  /**
   * Очищает текст от запрещенного контента (заменяет на ***)
   */
  sanitizeContent(content: string): string {
    let sanitized = content;

    for (const patterns of Object.values(this.patterns)) {
      for (const pattern of patterns) {
        sanitized = sanitized.replace(pattern, '***');
      }
    }

    return sanitized;
  }

  /**
   * Формирует причину блокировки на основе найденных паттернов
   */
  private getBlockReason(blockedPatterns: string[]): string {
    const reasons: { [key: string]: string } = {
      phone: 'Обнаружен номер телефона',
      email: 'Обнаружен email адрес',
      url: 'Обнаружена ссылка',
      messengers: 'Обнаружено упоминание мессенджера',
      obfuscated: 'Обнаружена попытка скрыть контактные данные',
      bannedPhrases: 'Обнаружена запрещенная фраза'
    };

    const foundReasons = blockedPatterns
      .map(pattern => reasons[pattern])
      .filter(Boolean);

    if (foundReasons.length === 0) {
      return 'Обнаружен запрещенный контент';
    }

    return foundReasons.join(', ');
  }

  /**
   * Получает предупреждающее сообщение для пользователя
   */
  getWarningMessage(): string {
    return 'Запрещено отправлять контактные данные (телефоны, email, ссылки) в чате. ' +
           'Все коммуникации проходят через менеджера для обеспечения безопасности сделки.';
  }
}

