const path = require('path');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtraneousFileCleanupPlugin = require('webpack-extraneous-file-cleanup-plugin');
const MergeIntoSingle = require('webpack-merge-and-include-globally');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log('---------------------------------BUILD START--------------------------------------------');


const entryScssArray = glob.sync('./src/app/pages/**/style.scss');

const entryScssObject = entryScssArray.reduce((accCss, item) => {
  let name = path.dirname(item.replace('./src/app/pages/', ''));
  accCss[name] = item;
  return accCss;
}, {});

const PagesScssConfig = {
  mode: 'production',
  devtool: false,
  entry: entryScssObject,
  output: {
    path: path.resolve(__dirname, '../build/css/pages'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: ['.js']
    })
  ]
}


const entryGlobalCssArray = glob.sync('./src/app/theme/style/libs/*.@(css|scss)');
const entryGlobalScssArrayBase = glob.sync('./src/app/theme/style/base/*.@(css|scss)');
const entryGlobalScssArrayLayout = glob.sync('./src/app/theme/style/*.@(css|scss)');

const GlobalCssConfig = {
  mode: 'production',
  devtool: false,
  entry: entryGlobalCssArray.concat(entryGlobalScssArrayBase).concat(entryGlobalScssArrayLayout),
  output: {
    path: path.resolve(__dirname, '../build/css'),
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "vendor.css",
      ignoreOrder: false
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: ['.js']
    })
  ]
};

/*CSS BUILD END*/

/*JAVASCRIT BUILD START*/

const entryArray = glob.sync('./src/app/pages/**/index.ts');
const entryObject = entryArray.reduce((acc, item) => {
  let name = path.dirname(item.replace('./src/app/pages/', ''));
  acc[name] = item;
  return acc;
}, {});

const PagesJsConfig = {
  mode: 'production',
  devtool: false,
  entry: entryObject,
  output: {
    path: path.resolve(__dirname, '../build/js/pages'),
    publicPath: '../build/js/pages',
    filename: '[name].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      Pages: path.resolve(__dirname, '../src/app/pages/'),
      Components: path.resolve(__dirname, '../src/app/components/'),
    }
  }
}

GLobalJsConfig = {
  mode: 'production',
  devtool: false,
  entry: './src/app/theme/script/main.js',
  output: {
    path: path.resolve(__dirname, '../build/js'),
    publicPath: '../build/js',
    filename: '[name].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
      })
    ]
  },
  plugins: [
    new MergeIntoSingle({
      files: {
        'vendor.js': [
          path.resolve(__dirname, '../src/app/theme/script/base/*.js'),
          path.resolve(__dirname, '../src/app/theme/script/libs/*.js'),
          path.resolve(__dirname, '../src/app/theme/script/*.js')
        ],
      }
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: ['main.js']
    })
  ]

}


/*JAVASCRIT BUILD END*/

module.exports = [PagesJsConfig, PagesScssConfig, GlobalCssConfig, GLobalJsConfig];

/*------------------------------BUILD END--------------------------------------------*/
