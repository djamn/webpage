module.exports = {
  darkMode: 'selector',
  // darkMode: ['variant', '&:not(.light *)'],
  // darkMode: ['selector', '[data-mode="dark"]'],
  content: ["./src/**/*.{html,js}", "./node_modules/tw-elements/js/**/*.js"],
  theme: {
    extend: {
      boxShadow: {
        'btn-1': '0 1px 0 rgba(27,31,35,0.1)'
      }
    },
  },
  plugins: [
    // require("tw-elements/plugin.cjs"),
    require('@tailwindcss/forms'),
  ],
}

