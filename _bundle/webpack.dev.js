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
  mode: 'development',
  devtool: 'inline-source-map',
  entry: entryScssObject,
  output: {
    path: path.resolve(__dirname, '../build/css/pages'),
    publicPath: '/build/css/pages/',
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

const entryGlobalCssArray = glob.sync('./assets/css/libs/*.css');

const GlobalCssConfig = {
  mode: 'development',
  devtool: false,
  entry: entryGlobalCssArray,
  output: {
    path: path.resolve(__dirname, '../build/css'),
    publicPath: '/build/css/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("libs.min.css"),
    new MiniCssExtractPlugin({
      filename: "[name].css"
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
  mode: 'development',
  devtool: 'inline-source-map',
  entry: entryObject,
  output: {
    path: path.resolve(__dirname, '../build/js/pages'),
    publicPath: '/build/js/pages/',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  optimization: {
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        cache: false,
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
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, '../'),
    compress: true,
    port: 9000
  }
}

PagesGLobalJsConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './assets/js/index.js',
  output: {
    path: path.resolve(__dirname, '../build/js'),
    publicPath: '/build/js/',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  optimization: {
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        cache: false,
      })
    ]
  },
  plugins: [
    new MergeIntoSingle({
      files: {
        'bundle.js': [
          path.resolve(__dirname, '../assets/js/base/*.js'),
          path.resolve(__dirname, '../assets/js/libs/*.js')
        ],
      }
    }),
    new ExtraneousFileCleanupPlugin({
      extensions: ['main.js']
    })
  ],

}


/*JAVASCRIT BUILD END*/

module.exports = [PagesJsConfig, PagesScssConfig, GlobalCssConfig, PagesGLobalJsConfig];

/*------------------------------BUILD END--------------------------------------------*/
