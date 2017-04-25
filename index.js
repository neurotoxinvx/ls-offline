var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var UglifyJs = require('uglify-js');

var utils = require('./utils');
var clientPath = path.join(__dirname, './client/index.js');
var client = '';

function LSOffline(options) {
  if (!options) {
    options = {};
  }

  if (options.cache !== false) {
    options.cache = true;
  }

  if (options.debug !== true) {
    options.debug = false;
  }

  this.options = options;

  if(!options.debug) {
    client = UglifyJs.minify(clientPath).code;
  } else {
    fs.readFile(clientPath, 'utf-8', function(err, data) {
      client = data;
    })
  }
}

LSOffline.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {

      var $ = cheerio.load(htmlPluginData.html, {
        decodeEntities: false
      });

      htmlPluginData.assets.css.forEach(function (item) {
        $('head').append(utils.createStyleTag(item))
      });

      /* compile javascript resource */

      var chunks = Object.keys(htmlPluginData.assets.chunks);
      var LS = {};
      var insertTemp = '';

      chunks.forEach(function(key) {
        LS = utils.initConfig(htmlPluginData.assets.chunks[key].entry)
      });

      insertTemp += utils.createConfig(LS);

      insertTemp += utils.createClient(client);

      insertTemp += utils.createKit(JSON.stringify(self.options));

      insertTemp = utils.appendScriptTag(insertTemp);

      $('body').append(insertTemp);

      htmlPluginData.html = $.html();

      callback(null, htmlPluginData);
    });
  });

};

module.exports = LSOffline;