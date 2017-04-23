var path = require('path')
var pck = require('./package.json')

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
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
    }),
    new LSOffline({
      page: pck.name,
      version: pck.version
    })
  ]
}