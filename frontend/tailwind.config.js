/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base usando variables CSS
        'base-bg': 'var(--bg)',
        'glass-bg': 'var(--glass)',
        'primary-purple': 'var(--brand-1)',
        'vibrant-blue': 'var(--brand-2)',
        'stem-green': 'var(--stem-green)',
        'logic-yellow': 'var(--math-yellow)',
        'cosmic-pink': 'var(--art-pink)',
        'soft-white': 'var(--text)',
        'steel-gray': 'var(--text-2)',

        // Categorías STEM
        'stem-math': 'var(--math-yellow)',
        'stem-science': 'var(--stem-green)',
        'stem-tech': 'var(--brand-2)',
        'stem-engineering': 'var(--stem-green)'
      }
    },
  },
  plugins: [],
}
