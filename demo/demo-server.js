require('shelljs/global')

var opn = require('opn')
var path = require('path')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var WebpackDevServer = require('webpack-dev-server')

var port = 8081

rm('-rf', './dist')

var compiler = webpack(webpackConfig, function (err, stats) {
  if (err) {
    console.log(err)
  }
})

var server = new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, './dist'),
  stats: {
    colors: true
  }
})

server.listen(port, 'localhost', function() {
  opn('http://localhost:' + port)
})