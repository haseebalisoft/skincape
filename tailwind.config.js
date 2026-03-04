/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#9DB5B2',
          light: '#B8CCC9',
          dark: '#7A9894',
        },
        forest: {
          DEFAULT: '#1F3D36',
          light: '#2D5449',
          dark: '#152B25',
        },
        cream: {
          DEFAULT: '#FAFAF8',
          light: '#FFFFFF',
          dark: '#F5F5F3',
        },
        warmGray: {
          DEFAULT: '#E6E8E7',
          light: '#F0F1F0',
          dark: '#D1D3D2',
        },
        gold: {
          DEFAULT: '#C9B37E',
          light: '#D9C89E',
          dark: '#B39D5E',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'luxury': '12px',
        'card': '16px',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(31, 61, 54, 0.08)',
        'luxury': '0 8px 32px rgba(31, 61, 54, 0.12)',
        'glow': '0 0 20px rgba(157, 181, 178, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
