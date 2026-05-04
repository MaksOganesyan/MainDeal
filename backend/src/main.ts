import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe, Logger } from '@nestjs/common'
import { join } from 'path'
import { AllExceptionsFilter } from './filters/http-exception.filter'

async function bootstrap() {
	const logger = new Logger('Bootstrap')
	
	try {
		const app = await NestFactory.create<NestExpressApplication>(AppModule, {
			logger: ['error', 'warn', 'log', 'debug', 'verbose']
		})
		
		// Глобальный фильтр ошибок
		app.useGlobalFilters(new AllExceptionsFilter())
		
		app.setGlobalPrefix('api')
		
		// Enable validation with transformation
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: false,
				transformOptions: {
					enableImplicitConversion: false // Отключаем неявное преобразование типов
				}
			})
		)
		
		app.useStaticAssets(join(process.cwd(), 'uploads'), {
			prefix: '/uploads'
		})
		app.enableCors({
			origin: 'http://localhost:3000',
			methods: 'GET, POST, PUT, DELETE, PATCH',
			allowedHeaders: 'Content-Type, Authorization',
			credentials: true, // Важно для cookies!
		})
		
		const port = process.env.PORT || 4200
		await app.listen(port)
		
		logger.log(`🚀 Application is running on: http://localhost:${port}`)
		logger.log(`📊 Health check available at: http://localhost:${port}/api/health`)
	} catch (error) {
		logger.error('Failed to start application', error)
		process.exit(1)
	}
}
bootstrap()
