import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { UserService } from './user.service'
import { userrole_role } from '@prisma/client'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth([userrole_role.CUSTOMER, userrole_role.EXECUTOR, userrole_role.MANAGER, userrole_role.ADMIN])
	@Get('profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getById(id)
	}

	@Auth([userrole_role.CUSTOMER, userrole_role.EXECUTOR, userrole_role.MANAGER, userrole_role.ADMIN])
	@Patch('profile')
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(id, dto)
	}

	@Auth([userrole_role.MANAGER, userrole_role.ADMIN])
	@Get('customers')
	async getCustomers() {
		return this.userService.getCustomers();
	}

	@Auth([userrole_role.MANAGER, userrole_role.ADMIN])
	@Post('customers')
	async createCustomer(@Body() dto: CreateCustomerDto) {
		return this.userService.createCustomer(dto);
	}

	@Auth([userrole_role.ADMIN])
	@Get('list')
	async getUsers() {
		return this.userService.getUsers();
	}

	@Auth([userrole_role.MANAGER, userrole_role.ADMIN])
	@Get('executors')
	async getExecutors() {
		return this.userService.getExecutors();
	}

	@Auth([userrole_role.ADMIN])
	@Post(':id/change-role')
	async changeUserRole(
		@Param('id', ParseIntPipe) userId: number,
		@Body() body: { roles: userrole_role[] }
	) {
		return this.userService.changeUserRole(userId, body.roles);
	}
}
