import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './decorators/auth.decorator';
import { userrole_role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    const response = await this.authService.login(dto);
    
    // Устанавливаем cookie с информацией о пользователе
    const userJson = encodeURIComponent(JSON.stringify(response.user));
    res.setHeader('Set-Cookie', `user=${userJson}; Path=/; HttpOnly=false; Secure=false; SameSite=Lax; Max-Age=86400`);
    
    return res.json(response);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.register(dto);
    
    // Устанавливаем cookie с информацией о пользователе
    const userJson = encodeURIComponent(JSON.stringify(response.user));
    res.setHeader('Set-Cookie', `user=${userJson}; Path=/; HttpOnly=false; Secure=false; SameSite=Lax; Max-Age=86400`);
    
    return res.json(response);
  }

  @Auth([userrole_role.MANAGER, userrole_role.ADMIN])
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register-executor')
  async registerExecutor(
    @Body() dto: AuthDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.registerExecutor(dto);
    
    // Устанавливаем cookie с информацией о пользователе
    const userJson = encodeURIComponent(JSON.stringify(response.user));
    res.setHeader('Set-Cookie', `user=${userJson}; Path=/; HttpOnly=false; Secure=false; SameSite=Lax; Max-Age=86400`);
    
    return res.json(response);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return res.json({ message: 'Logged out successfully' });
  }

  @Post('access-token')
  @HttpCode(200)
  async getAccessToken(@Req() req: Request, @Res() res: Response) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new UnauthorizedException('No user session found');
    }
    
    // Простая парсилка cookies
    const cookies = this.parseCookies(cookieHeader);
    const userCookie = cookies.user;
    
    if (!userCookie) {
      throw new UnauthorizedException('No user session found');
    }
    
    const user = JSON.parse(decodeURIComponent(userCookie));
    return res.json({ user });
  }

  @Get('me')
  @HttpCode(200)
  async getMe(@Req() req: Request, @Res() res: Response) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.json({ user: null });
    }
    
    // Простая парсилка cookies
    const cookies = this.parseCookies(cookieHeader);
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
