const path = require("path");
const glob = require("glob");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtraneousFileCleanupPlugin = require("webpack-extraneous-file-cleanup-plugin");
const MergeIntoSingle = require("webpack-merge-and-include-globally");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

/*GLOBAL CSS BUILD START */
const entryGlobalCssArray = glob.sync("./src/app/theme/style/libs/*.@(css|scss)");
const entryGlobalScssArrayBase = glob.sync("./src/app/theme/style/base/*.@(css|scss)");
const entryGlobalScssArrayLayout = glob.sync("./src/app/theme/style/*.@(css|scss)");

const GlobalCssConfig = {
  mode: "production",
  devtool: false,
  entry: entryGlobalCssArray
    .concat(entryGlobalScssArrayBase)
    .concat(entryGlobalScssArrayLayout),
  output: {
    path: path.resolve(__dirname, "../build/css")
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "vendor.css",
      ignoreOrder: false
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: [".js",".ts", ".tsx"]
    })
  ]
};
/*GLOBAL CSS BUILD END*/

/*GLOBAL JS BUILD START */
GLobalJsConfig = {
  mode: "production",
  devtool: false,
  entry: "./src/app/theme/script/main.js",
  output: {
    path: path.resolve(__dirname, "../build/js"),
    publicPath: "../build/js",
    filename: "[name].js"
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true
      })
    ]
  },
  plugins: [
    new MergeIntoSingle({
      files: {
        "vendor.js": [
          path.resolve(__dirname, "../src/app/theme/script/base/*.js"),
          path.resolve(__dirname, "../src/app/theme/script/libs/*.js"),
          path.resolve(__dirname, "../src/app/theme/script/*.js")
        ]
      }
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: ["main.js"]
    })
  ]
};
/*GLOBAL JS BUILD END*/

/*PAGES JS AND CSS BUILD START*/
const entryArray = glob.sync("./src/app/pages/**/index.ts");
const entryObject = entryArray.reduce((acc, item) => {
  let name = path.dirname(item.replace("./src/app/pages/", ""));
  acc[name] = item;
  return acc;
}, {});

const PagesConfig = {
  mode: "production",
  devtool: false,
  entry: entryObject,
  output: {
    path: path.resolve(__dirname, "../build/pages"),
    publicPath: "../build/pages",
    filename: "[name].js"
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  plugins: [new ExtractTextPlugin({ filename: "[name].css" })],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      Pages: path.resolve(__dirname, "../src/app/pages/"),
      Components: path.resolve(__dirname, "../src/app/components/")
    }
  }
};
/*PAGES JS AND CSS BUILD END*/


module.exports = [
  PagesConfig,
  GlobalCssConfig,
  GLobalJsConfig
];

/*------------------------------BUILD END--------------------------------------------*/
