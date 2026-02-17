import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: '/Cribbage/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    https: true,
    port: 3000
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})
