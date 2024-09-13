/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  // darkMode: ['selector', '[data-mode="dark"]'],
  // darkMode: ['variant', '&:not(.light *)'],
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      boxShadow: {
        'btn-1': '0 1px 0 rgba(27,31,35,0.1)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

