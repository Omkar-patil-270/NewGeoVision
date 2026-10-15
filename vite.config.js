import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleKey = env.GOOGLE_MAPS_API_KEY || env.VITE_GOOGLE_MAPS_API_KEY || '';
  const groqKey = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || '';
  const openaqKey = env.OPENAQ_API_KEY || env.VITE_OPENAQ_API_KEY || '';

  return {
    plugins: [react(), cesium()],
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(googleKey),
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(groqKey),
      'import.meta.env.VITE_OPENAQ_API_KEY': JSON.stringify(openaqKey),
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(googleKey),
      'process.env.GROQ_API_KEY': JSON.stringify(groqKey),
      'process.env.OPENAQ_API_KEY': JSON.stringify(openaqKey)
    },
    server: {
      port: 5173,
      host: true
    }
  };
});
