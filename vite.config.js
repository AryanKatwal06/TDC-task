import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    allowedHosts: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          router:   ['react-router-dom'],
          store:    ['zustand'],
        },
      },
    },
  },

  test: {
    globals:     true,
    environment: 'jsdom',
    setupFiles:  ['./src/__tests__/setup.js'],
    coverage: {
      reporter: ['text', 'lcov'],
      include:  ['src/**/*.{js,jsx}'],
      exclude:  ['src/__tests__/**', 'src/main.jsx'],
    },
  },
})