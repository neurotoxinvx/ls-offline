var path = require('path')

var HtmlWebpackPlugin = require('html-webpack-plugin')
var LSOffline = require('../index.js')

module.exports = {
  entry: {
    index: './demo/src/main.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
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
      cache: true,
      debug: false
    })
  ]
}