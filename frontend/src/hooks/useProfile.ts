import { authService } from '@/services/auth/auth.service'
import { useQuery } from '@tanstack/react-query'
import { transformUserToState } from './transform-user-to-state'

export function useProfile() {
	const { data, isLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: () => authService.getCurrentUser(), // Используем authService вместо userService
		retry: false, // Убрали retry для избежания лишних запросов при 401
		refetchInterval: 1800000 // 30 minutes in milliseconds,
	})

	const userState = data ? transformUserToState(data) : null

	return {
		isLoading,
		user: data ? {
			...data,
			...userState
		} : {
			isLoggedIn: false,
			isCustomer: false,
			isExecutor: false,
			isSupport: false,
			isAdmin: false,
			roles: []
		}
	}
}
