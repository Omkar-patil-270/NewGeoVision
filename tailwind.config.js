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
        background: '#070B14', // Deep obsidian canvas
        foreground: '#F1F5F9', // Crisp luminous slate
        obsidian: {
          DEFAULT: '#0B0F19',
          deep: '#04070F',
          surface: '#0D1527',
          card: '#0F1A30',
          border: 'rgba(6, 182, 212, 0.2)'
        },
        hud: {
          panel: 'rgba(11, 19, 43, 0.75)',
          border: 'rgba(6, 182, 212, 0.25)',
          glow: '#00F2FE',
          accent: '#06B6D4'
        },
        biolum: {
          cyan: '#00F2FE',
          emerald: '#10B981',
          blue: '#3B82F6',
          violet: '#8B5CF6'
        },
        primary: {
          DEFAULT: '#00F2FE', // Luminous Cyan
          hover: '#38BDF8',
          soft: 'rgba(6, 182, 212, 0.15)',
          deep: '#0891B2',
          border: 'rgba(6, 182, 212, 0.3)',
        },
        border: {
          DEFAULT: 'rgba(148, 163, 184, 0.12)',
          hud: 'rgba(6, 182, 212, 0.25)',
          cyan: 'rgba(6, 182, 212, 0.4)',
          emerald: 'rgba(16, 185, 129, 0.35)',
          amber: 'rgba(245, 158, 11, 0.35)',
          rose: 'rgba(244, 63, 94, 0.35)'
        }
      },
      boxShadow: {
        'hud-glow': '0 0 25px -4px rgba(0, 242, 254, 0.25)',
        'emerald-glow': '0 0 25px -4px rgba(16, 185, 129, 0.25)',
        'hud-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(6, 182, 212, 0.15)',
        'glass-elevated': '0 20px 50px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      }
    },
  },
  plugins: [],
}
