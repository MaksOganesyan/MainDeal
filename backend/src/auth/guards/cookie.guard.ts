import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const cookieHeader = request.headers.cookie;
    
    if (!cookieHeader) {
      throw new UnauthorizedException('No user session found');
    }
    
    // Простая парсилка cookies без cookie-parser
    const cookies = this.parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      throw new UnauthorizedException('No user session found');
    }
    
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid user session');
    }
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=');
      if (name && rest.length) {
        cookies[name] = rest.join('=');
      }
    });
    
    return cookies;
  }
}
