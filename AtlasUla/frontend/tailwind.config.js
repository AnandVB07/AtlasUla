/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        card: '#161B33',
        primary: {
          DEFAULT: '#7C5CFF',
          dark: '#623df5',
          light: '#a18aff',
        },
        accent: {
          DEFAULT: '#00D4FF',
          dark: '#00a3c4',
          light: '#66e6ff',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        textPrimary: '#FFFFFF',
        textSecondary: '#B6C2CF',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Sora', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}
