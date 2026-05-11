import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    allowedHosts: ['js.makedetail.online'],
    proxy: {
      '/api': {
        target: 'http://localhost:4200',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 0,           // 🔥 Не кодирует картинки в base64
    reportCompressedSize: false,    // 🔥 Пропускает расчёт gzip (экономит ~40% времени)
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui-core': ['@mui/material', '@mui/system'],
          'mui-icons': ['@mui/icons-material'],
          'charts': ['chart.js', 'react-chartjs-2']
        }
      }
    }
  }
})
