import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),    
  ],
  server: {
    host: '0.0.0.0', // or use `true` for shorthand
    port: 5173       // optional: customize the port if needed
  }
})
