/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  // darkMode: ['selector', '[data-mode="dark"]'],
  // darkMode: ['variant', '&:not(.light *)'],
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

