const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const IconfontPlugin = require("iconfont-plugin-webpack");

const resolve = path.resolve.bind(path, __dirname);

module.exports = {
  context: __dirname,
  entry: {
    index: path.resolve("./src/index.js"),
  },
  output: {
    path: resolve("../../build"),
    filename: "[name].js",
  },
  plugins: [
    new IconfontPlugin({
      src: "./src/assets/icons/",
      family: "iconfont",
      dest: {
        font: resolve("../../build/fonts/[family].[type]"),
        css: resolve("../../build/scss/_[family].scss"),
      },
      watch: {
        cwd: __dirname,
        pattern: "icons-default/*.svg",
      },
    }),
    new ExtractTextPlugin("[name].css"),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"],
        }),
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
};
