import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { userrole_role, type User, userrole } from '@prisma/client';
import { verify, hash } from 'argon2';
import { omit } from 'lodash';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { validate } from 'class-validator';

export interface UserWithRoles extends Omit<User, 'userrole'> {
  userrole: { role: userrole_role }[];
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    return { user: this.omitPassword(user) };
  }

  async register(dto: AuthDto | RegisterDto) {
    const existingUser = await this.userService.getByLogin(dto.email);
    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new BadRequestException('User with this email already exists');
      } else {
        throw new BadRequestException('User with this login already exists');
      }
    }

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const hashedPassword = await hash(dto.password);
    const login = dto.login || dto.email.split('@')[0];

    // Обрабатываем роль из enum или строки
    let role: userrole_role[] = [userrole_role.CUSTOMER];
    if ('role' in dto && dto.role) {
      role = [dto.role];
    } else if ('roleString' in dto && dto.roleString) {
      // Преобразуем строку в enum
      const roleStr = dto.roleString.toUpperCase();
      if (Object.values(userrole_role).includes(roleStr as userrole_role)) {
        role = [roleStr as userrole_role];
      }
    }

    const user = await this.prisma.user.create({
      data: {
        login,
        email: dto.email,
        password: hashedPassword,
        fullName: 'fullName' in dto ? dto.fullName : undefined,
        phone: 'phone' in dto ? dto.phone : undefined,
        userrole: {
          create: role.map(r => ({ role: r }))
        },
      },
      select: {
        id: true,
        login: true,
        email: true,
        fullName: true,
        phone: true,
        userrole: {
          select: { role: true }
        },
        password: false // Исключаем пароль из ответа
      }
    });

    return { user: this.omitPassword(user) };
  }

  async registerExecutor(dto: AuthDto) {
    const registerDto: RegisterDto = {
      ...dto,
      role: userrole_role.EXECUTOR,
    };
    return this.register(registerDto);
  }

  private async validateUser(dto: AuthDto) {
    let user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      select: {
        id: true,
        login: true,
        email: true,
        fullName: true,
        phone: true,
        userrole: {
          select: { role: true }
        },
        password: true // Нужен пароль для валидации
      }
    });

    if (!user && dto.login) {
      user = await this.prisma.user.findFirst({
        where: { login: dto.login },
        select: {
          id: true,
          login: true,
          email: true,
          fullName: true,
          phone: true,
          userrole: {
            select: { role: true }
          },
          password: true // Нужен пароль для валидации
        }
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    try {
      const isValid = await verify(user.password, dto.password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private omitPassword(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
