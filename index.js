var cheerio = require('cheerio')
var utils = require('./utils')
var client = require('./client')

function LSOffline(options) {
  this.options = options
}

LSOffline.prototype.apply = function(compiler) {
  var self = this

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
        LS = utils.initConfig(self.options.version, key, htmlPluginData.assets.chunks[key].entry)
      })

      insertTemp += utils.createConfig(LS)

      insertTemp += utils.createClient(client, '__client__', self.options.type)

      $('body').append(insertTemp)

      htmlPluginData.html = $.html()

      callback(null, htmlPluginData);
    });
  });

};

module.exports = LSOffline;