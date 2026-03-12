/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          dark: '#12121a',
          card: '#1a1a2e',
          border: '#2a2a3e',
          green: '#00ff41',
          cyan: '#00d4ff',
          red: '#ff3e3e',
          orange: '#ff9f43',
          yellow: '#ffd32a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
