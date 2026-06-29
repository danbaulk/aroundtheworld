import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Ensure a single React instance (react-simple-maps pulls in its own React tree otherwise).
  resolve: { dedupe: ['react', 'react-dom'] },
})
