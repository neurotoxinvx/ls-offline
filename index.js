var cheerio = require('cheerio')
var utils = require('./utils')
var clientKit = require('./clientKit')
var version = require('./package.json').version

function LSOffline(options) {
  this.options = options
}

LSOffline.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {

      var $ = cheerio.load(htmlPluginData.html, {
        decodeEntities: false
      })

      htmlPluginData.assets.css.forEach(function (item) {
        $('head').append(utils.createStyleTag(item))
      })

      /* compile javascript resource */

      var chunks = Object.keys(htmlPluginData.assets.chunks)
      var LS = {}
      var insertTemp = ''

      chunks.forEach(function(key) {
        LS = utils.createConfig(version, key, htmlPluginData.assets.chunks[key].entry)
      })

      insertTemp += utils.concatConfig(LS)

      insertTemp += utils.concatClientKit(clientKit, '__clientKit__')

      $('body').append(insertTemp)

      htmlPluginData.html = $.html()

      callback(null, htmlPluginData);
    });
  });

};

module.exports = LSOffline;