export enum UserRole {
	CUSTOMER = 'CUSTOMER',
	EXECUTOR = 'EXECUTOR',
	MANAGER = 'MANAGER',
	ADMIN = 'ADMIN'
}

export interface ITokenInside {
	id: number
	roles: UserRole[]
	iat: number
	exp: number
}

export type TProtectUserData = Omit<ITokenInside, 'iat' | 'exp'> & {
  userrole?: { role: UserRole }[];
}