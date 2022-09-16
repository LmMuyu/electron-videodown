module.exports = {
  content: [],
  purge: ["./src/renderer/index.html", "./src/renderer/src/**/*.{vue,ts,tsx,jsx,js}"],
  theme: {
    textColor: (theme) => theme("colors"),
    textColor: {
      "el-primary": "#303133",
      "el-brand": "#409EFF",
    },
    extend: {},
  },
  plugins: [],
};
