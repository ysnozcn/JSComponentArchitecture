const path = require('path');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

console.log('--------------------------------------------------------------------------------------');

const entryArray = glob.sync('./src/app/pages/**/index.ts');
console.log(entryArray);
const entryObject = entryArray.reduce((acc, item) => {
    let name = path.dirname(item.replace('./src/app/pages/', ''));
    acc[name] = item;
    return acc;
}, {});
console.log(path.resolve(__dirname, 'build/js'));

const PagesJsConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: entryObject,
    output: {
        path: path.resolve(__dirname, 'build/js'),
        publicPath: 'build/js',
        filename: '[name].js',
        sourceMapFilename: '[file].map'
    },
    optimization: {
        minimize: false
    },
    target: 'web',
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

const entryScssArray = glob.sync('./src/app/pages/**/*.scss');

const entryScssObject = entryScssArray.reduce((acc, item) => {
    let name = path.dirname(item.replace('./src/app/pages/', ''));
    acc[name] = item;
    return acc;
}, {});

const PagesScssConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: entryScssObject,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}

module.exports = [PagesJsConfig, PagesScssConfig];