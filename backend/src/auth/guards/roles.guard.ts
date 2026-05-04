import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userrole_role } from '@prisma/client';
import { Request } from 'express'

export interface UserWithRoles {
	id: number
	login: string
	email: string
	userrole: userrole_role[]
}

interface RequestWithUser extends Request {
	user?: UserWithRoles
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<userrole_role[]>('roles', context.getHandler())
		if (!roles) {
			return true
		}

		const request = context.switchToHttp().getRequest<RequestWithUser>()
		const user = request.user

		if (!user) {
			return false
		}

		// Проверяем роли пользователя из userrole
		const userRoles = user.userrole ? user.userrole.map((r: any) => r.role) : []
		
		return roles.some((role) => userRoles.includes(role))
		return true
	}
}
