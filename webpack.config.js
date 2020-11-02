const path = require("path");

module.exports = {
  entry: [
    "/js/utils.js",
    "/js/backend.js",
    "/js/pin.js",
    "/js/card.js",
    "/js/main.js",
    "/js/avatar.js",
    "/js/move-pin.js",
    "/js/form.js",
    "/js/debounce.js",
    "/js/filter.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
