import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // MUDA ISTO PARA O TEU LINK DO RENDER (SEM BARRA NO FIM)
        target: 'https://ligacao-backend.onrender.com', 
        changeOrigin: true,
      }
    }
  }
})