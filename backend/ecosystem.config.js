module.exports = {
  apps: [
    {
      name: 'detail-deal-backend',
      script: 'dist/main.js',
      instances: 2, // Количество процессов (или 'max' для всех CPU)
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Автоперезапуск при изменении файлов (отключено в production)
      watch: false,
      // Максимальное использование памяти
      max_memory_restart: '500M',
      // Автоматическая перезагрузка при падении
      autorestart: true,
      // Задержка между перезапусками
      restart_delay: 3000,
      // Количество перезапусков при нестабильной работе
      max_restarts: 10,
      // Минимальное время работы для считывания стабильным
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'YOUR_SERVER_IP',
      ref: 'origin/main',
      repo: 'YOUR_GIT_REPOSITORY',
      path: '/var/www/detail-deal',
      'post-deploy': 'cd dd-back && yarn install && npx prisma migrate deploy && yarn db:generate && yarn build && pm2 reload ecosystem.config.js --env production'
    }
  }
};


