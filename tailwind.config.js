/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        background: '#FAF7F2', // Warm cream canvas
        foreground: '#1E1B18', // Deep editorial charcoal
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#F95721', // Signature vibrant coral
          hover: '#EA4A15',
          soft: '#FFF1EB',
          deep: '#C23D10',
          border: '#FED7AA',
        },
        border: {
          DEFAULT: '#E7E2DA',
          warm: '#E2DBD0',
          coral: '#FDBA74',
          emerald: '#A7F3D0',
          violet: '#DDD6FE',
          sky: '#BAE6FD',
          amber: '#FDE68A',
        },
        muted: {
          DEFAULT: '#F4EFE6',
          foreground: '#78716C',
        },
        accent: {
          DEFAULT: '#0284C7',
          soft: '#F0F9FF',
          foreground: '#0369A1',
        },
        tag: {
          coral: { bg: '#FFF1EB', text: '#C2410C', border: '#FDBA74' },
          emerald: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
          violet: { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
          amber: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
          sky: { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
          rose: { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 12px 36px -4px rgba(28, 25, 23, 0.08)',
        'coral-glow': '0 8px 24px -4px rgba(249, 87, 33, 0.25)',
        'card-mixed': '0 10px 30px -5px rgba(249, 87, 33, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
