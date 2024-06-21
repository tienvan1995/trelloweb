import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svg from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    svg()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
