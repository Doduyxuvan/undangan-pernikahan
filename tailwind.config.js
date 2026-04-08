/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      colors: {
        gold: {
          50: '#fdf8ec',
          100: '#faefc9',
          200: '#f5dc8f',
          300: '#f0c555',
          400: '#e8a820',
          500: '#d4891a',
          600: '#b86d12',
          700: '#9a5411',
          800: '#7d4114',
          900: '#673615',
        },
        cream: {
          50: '#fdf8ec',
          100: '#faefc9',
          200: '#f5dc8f',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(-50%)' },
          '50%': { transform: 'translateY(-10px) translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
