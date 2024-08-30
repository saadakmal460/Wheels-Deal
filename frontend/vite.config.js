import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],

  build: {
    outDir: 'dist', // This should be 'dist'
  },
  server:{
    proxy:{
      '/api':{
        target: 'http://localhost:3000',
        secure: false
      },
      
    },
  },

  

})
