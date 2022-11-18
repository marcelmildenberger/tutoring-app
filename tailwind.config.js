module.exports = {
  content: [
    "./components/**/*.{html,js}",
    "./screens/**/*.{html,js}",
    "./App.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: require("tailwind-rn/unsupported-core-plugins"),
};
