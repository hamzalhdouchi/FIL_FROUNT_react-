// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Assure-toi que ça correspond à ta structure
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf6f2',
          100: '#f5ede3',
          200: '#ead9c7',
          300: '#ddc2a5',
          400: '#cca57d',
          500: '#bd8c5e',
          600: '#a97347',
          700: '#8c5e3b',
          800: '#734d34',
          900: '#5f402e',
        },
        olive: {
          50: '#f8f9f2',
          100: '#eef0e2',
          200: '#dde3c7',
          300: '#c5cea3',
          400: '#aab77d',
          500: '#8d9c5a',
          600: '#6f7c43',
          700: '#5a6538',
          800: '#4a5331',
          900: '#3e462c',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Lora', 'serif'],
        brand: ['Montserrat', 'sans-serif'],
        layfair: ['"Playfair Display"', 'serif'], 
        
      },
    },
  },
  plugins: [],
};
