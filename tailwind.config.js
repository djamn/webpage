module.exports = {
  darkMode: 'selector',
  // darkMode: ['variant', '&:not(.light *)'],
  // darkMode: ['selector', '[data-mode="dark"]'],
  content: ["./src/**/*.{html,js}", "./node_modules/tw-elements/js/**/*.js", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      boxShadow: {
        'btn-1': '0 1px 0 rgba(27,31,35,0.1)'
      },
      colors: {
        'dark-mode': '#050505',
        'dark-mode-inside': '#1f2937',
        'dark-mode-inside-hover': '#2a3748',
        'title-dark-mode-text':'#eaeaea',
        'dark-mode-text': '#909090'
      },
      keyframes: {
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
      },
      animation: {
        fadeInDown: 'fadeInDown 0.5s ease-out forwards',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        fadeInRight: 'fadeInRight 0.5s ease-out forwards',
        fadeInLeft: 'fadeInLeft 0.5s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        bounce: 'bounce 1.5s infinite',
      }
    },
  },
  plugins: [
    // require("tw-elements/plugin.cjs"),
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
  ],
}

