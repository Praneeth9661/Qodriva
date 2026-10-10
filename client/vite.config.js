import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_API_MODE, VITE_API_URL } = loadEnv(mode, '.', 'VITE_')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      ...(VITE_API_MODE !== 'demo' && !VITE_API_URL && {
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          },
        },
      }),
    },
  }
})
