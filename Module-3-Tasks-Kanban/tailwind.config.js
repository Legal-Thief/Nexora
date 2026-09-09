/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
        surface: { 0: '#0f0f10', 1: '#18181b', 2: '#1f1f23', 3: '#27272a', 4: '#3f3f46' },
      },
    },
  },
  plugins: [],
};
