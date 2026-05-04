// URL для API запросов
export const getServerUrl = (path?: string) => {
	return import.meta.env.VITE_NODE_ENV === 'production'
		? `https://api.dd.ilyacode.ru${path || ''}`
		: `http://localhost:4200${path || ''}`
}

// URL для статических файлов (изображения, uploads)
export const getUploadsUrl = () => {
	return import.meta.env.VITE_NODE_ENV === 'production'
		? 'https://dd.ilyacode.ru'
		: 'http://localhost:4200'
}
