var path = require('path')
var version = require('./package.json').version
var { readFileSync } = require('fs')
var babelSettings = JSON.parse(readFileSync('.babelrc'))

var HtmlWebpackPlugin = require('html-webpack-plugin')
var LSOffline = require('./index.js')

require('shelljs/global');

rm('-rf', './dist');

module.exports = {
  entry: {
    index: './src/main.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: babelSettings
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      minify: false
    }),
    new LSOffline({
      version: version
    })
  ]
}