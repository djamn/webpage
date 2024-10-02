/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  // darkMode: ['variant', '&:not(.light *)'],
  // darkMode: ['selector', '[data-mode="dark"]'],
  content: ["./src/**/*.{html,ts,json}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        'orange-gradient': 'linear-gradient(to right, #ff1835, #ffc900)',
        'blue-gradient': 'linear-gradient(to right, #0077ff, #00e7df)',
        'rosa-gradient': 'linear-gradient(to right, #7f00de, #ff007f)',
      },
      padding: {
        '0.25': '0.09rem'
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      boxShadow: {
        'btn-1': '0 1px 0 rgba(27,31,35,0.1)'
      },
      colors: {
        'dark-mode': '#050505',
        'dark-mode-inside': '#1f2937',
        'dark-mode-inside-hover': '#2a3748',
        'title-dark-mode-text': '#eaeaea',
        'dark-mode-text': '#909090',
        'dark-mode-text-hover': '#787878'
      },
      keyframes: {
        blurIn: {
          '0%': { filter: 'blur(8px)' },
          '100%': { filter: 'blur(0px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.1)' },
          '100%': { transform: 'scale(1)' },
        },
        blurScaleIn: {
          '0%': { filter: 'blur(100px)', transform: 'scale(0.1)' },
          '50%': { transform: 'scale(1)' },
          '100%': { filter: 'blur(0px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeInDown: {
          '0%': {opacity: '0', transform: 'translateY(-20px)'},
          '100%': {opacity: '1', transform: 'translateY(0)'},
        },
        fadeInUp: {
          '0%': {opacity: '0', transform: 'translateY(20px)'},
          '100%': {opacity: '1', transform: 'translateY(0)'},
        },
        fadeInRight: {
          '0%': {opacity: '0', transform: 'translateX(-20px)'},
          '100%': {opacity: '1', transform: 'translateX(0)'},
        },
        fadeInLeft: {
          '0%': {opacity: '0', transform: 'translateX(20px)'},
          '100%': {opacity: '1', transform: 'translateX(0)'},
        },
        fadeInSlow: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
      },
      animation: {
        blurIn: 'blurIn 1s ease-out forwards',
        blurScaleIn: 'blurScaleIn 0.7s ease-out forwards',
        scaleIn: 'scaleIn 0.5s ease-out forwards',
        blink: 'blink 1s step-end infinite',
        fadeInDown: 'fadeInDown 0.5s ease-out forwards',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        fadeInRight: 'fadeInRight 0.5s ease-out forwards',
        fadeInLeft: 'fadeInLeft 0.5s ease-out forwards',
        fadeInSlow: 'fadeInSlow 0.5s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        bounce: 'bounce 1.5s infinite',
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
  ],
  autoprefixer: {},
}

