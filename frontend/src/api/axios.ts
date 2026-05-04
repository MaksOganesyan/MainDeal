import { API_URL } from '@/constants'
import axios, { CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: getContentType(),
	withCredentials: true, // Важно для отправки cookies
}

export const axiosClassic = axios.create(axiosOptions)

// Убран JWT interceptor - cookies отправляются автоматически
// Бэкенд NestJS обрабатывает аутентификацию через cookies

// Экспортируем также как api для совместимости
export const api = axiosClassic
