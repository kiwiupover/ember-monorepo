/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', './app/**/*.{hbs,gts,js,ts,gjs}'],
  theme: {
    extend: {},
  },
  plugins: ['@tailwindcss/forms'],
};
