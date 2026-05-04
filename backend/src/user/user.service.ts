import { AuthDto } from '@/auth/dto/auth.dto'
import { Injectable, BadRequestException } from '@nestjs/common'
import type { User, userrole } from '@prisma/client'
import { userrole_role } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { CreateCustomerDto } from 'src/user/dto/create-customer.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'

export interface UserWithRoles extends User {
	userrole: userrole[]
}

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUsers() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				login: true,
				email: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false
			}
		})
	}

	async getById(id: number) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				login: true,
				email: true,
				fullName: true,
				phone: true,
				userrole: {
					select: {
						role: true
					}
				},
				avatar: true,
				registeredAt: true,
				password: false // Исключаем пароль из ответа
			}
		})
	}

	async getByLogin(login: string) {
		return this.prisma.user.findFirst({
			where: {
				OR: [
					{ login },
					{ email: login }
				]
			},
			select: {
				id: true,
				login: true,
				email: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false // Исключаем пароль из ответа
			}
		})
	}

	async create(dto: AuthDto) {
		const login = dto.login || dto.email.split('@')[0];
		return this.prisma.user.create({
			data: {
				login,
				email: dto.email,
				password: dto.password,
				userrole: {
					create: [{ role: userrole_role.CUSTOMER }]
				}
			},
			select: {
				id: true,
				login: true,
				email: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false // Исключаем пароль из ответа
			}
		})
	}

	async update(id: number, data: Partial<User>) {
		return this.prisma.user.update({
			where: {
				id
			},
			data
		})
	}

	async updateProfile(id: number, dto: UpdateUserDto) {
		try {
			// Валидация входных данных
			if (!id || id <= 0) {
				throw new BadRequestException('Invalid user ID');
			}

			// Проверяем существование пользователя
			const user = await this.prisma.user.findUnique({
				where: { id },
				include: {
					userrole: {
						select: {
							role: true
						}
					}
				}
			});

			if (!user) {
				throw new BadRequestException('User not found');
			}

			// Обновляем только разрешенные поля
			const updateData: Partial<User> = {};
			
			if (dto.fullName !== undefined) {
				updateData.fullName = dto.fullName;
			}
			
			if (dto.phone !== undefined) {
				updateData.phone = dto.phone;
			}

			if (dto.avatar !== undefined) {
				updateData.avatar = dto.avatar;
			}

			// Email не разрешаем обновлять через этот метод
			// Это требует дополнительной верификации

			return this.prisma.user.update({
				where: { id },
				data: updateData,
				select: {
					id: true,
					login: true,
					email: true,
					fullName: true,
					phone: true,
					userrole: {
						select: {
							role: true
						}
					},
					avatar: true,
					registeredAt: true,
					password: false // Исключаем пароль из ответа
				}
			});
		} catch (error) {
			console.error('Error updating profile:', error);
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException('Failed to update profile');
		}
	}

	async getCustomers() {
		return this.prisma.user.findMany({
			where: {
				userrole: {
					some: {
						role: userrole_role.CUSTOMER
					}
				}
			},
			select: {
				id: true,
				login: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false
			}
		});
	}

	async createCustomer(dto: CreateCustomerDto) {
		return this.prisma.user.create({
			data: {
				login: dto.login,
				email: dto.email,
				password: dto.password,
				fullName: dto.fullName,
				userrole: {
					create: [{ role: userrole_role.CUSTOMER }]
				}
			},
			select: {
				id: true,
				login: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false
			}
		});
	}

	async getExecutors() {
		return this.prisma.user.findMany({
			where: {
				userrole: {
					some: {
						role: userrole_role.EXECUTOR
					}
				}
			},
			select: {
				id: true,
				login: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false
			}
		});
	}

	async changeUserRole(userId: number, roles: userrole_role[]) {
		// First, delete existing userrole
		await this.prisma.userrole.deleteMany({
			where: { userId }
		});

		// Then create new userrole
		await this.prisma.userrole.createMany({
			data: roles.map(role => ({
				userId,
				role
			}))
		});

		// Return updated user with userrole
		return this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				login: true,
				fullName: true,
				userrole: {
					select: {
						role: true
					}
				},
				password: false
			}
		});
	}
}
