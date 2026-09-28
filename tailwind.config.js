/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:   { DEFAULT: '#111827', soft: '#374151', mute: '#6B7280' },
        brand: { DEFAULT: '#0D9488', dark: '#0F766E', light: '#CCFBF1' },
        ayush: { DEFAULT: '#D97706', light: '#FEF3C7' },
        danger:{ DEFAULT: '#DC2626', light: '#FEE2E2' },
        info:  { DEFAULT: '#2563EB', light: '#DBEAFE' },
        ok:    { DEFAULT: '#16A34A', light: '#DCFCE7' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
