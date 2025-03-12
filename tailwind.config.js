module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        theme: {
          primary: {
            DEFAULT: '#5AC5DD', // Red
          },
          secondary: {
            DEFAULT: '#FFFFFF', // White
          },
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
