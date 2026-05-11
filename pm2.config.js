module.exports = {
  apps: [
    {
      name: 'makedetail-frontend',
      script: 'yarn',
      args: 'workspace frontend dev --host',
      cwd: '/home/makedetail-js/htdocs/js.makedetail.online',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 5173
      },
      error_file: '/home/makedetail-js/logs/frontend-error.log',
      out_file: '/home/makedetail-js/logs/frontend-out.log',
      log_file: '/home/makedetail-js/logs/frontend-combined.log',
      time: true
    },
    {
      name: 'makedetail-backend',
      script: 'yarn',
      args: 'workspace backend start',
      cwd: '/home/makedetail-js/htdocs/js.makedetail.online',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4200
      },
      error_file: '/home/makedetail-js/logs/backend-error.log',
      out_file: '/home/makedetail-js/logs/backend-out.log',
      log_file: '/home/makedetail-js/logs/backend-combined.log',
      time: true
    }
  ]
};
