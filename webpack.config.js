var path = require('path')
var version = require('./package.json').version

var HtmlWebpackPlugin = require('html-webpack-plugin')
var LSOffline = require('./index.js')

require('shelljs/global');

rm('-rf', './example');

module.exports = {
  entry: {
    index: './src/main.js'
  },
  output: {
    path: path.join(__dirname, './example'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false
    }),
    new LSOffline({
      version: version
    })
  ]
}