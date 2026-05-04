import Cookies from 'js-cookie'

import { EnumTokens } from './auth.service'

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: import.meta.env.VITE_NODE_ENV === 'production' ? 'dd.ilyacode.ru' : 'localhost',
		sameSite: 'strict',
		expires: 1,
	})
}

export const removeFromStorage = () => {
	// Удаляем с тем же domain, что был при установке
	const domain = import.meta.env.VITE_NODE_ENV === 'production' ? 'dd.ilyacode.ru' : 'localhost';
	
	// Пробуем удалить с domain
	Cookies.remove(EnumTokens.ACCESS_TOKEN, { domain });
	
	// Также пробуем удалить без domain (на случай если куки были установлены без домена)
	Cookies.remove(EnumTokens.ACCESS_TOKEN);
}
