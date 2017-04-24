var utils = module.exports;

var LS = {
  entry: []
};

utils.initConfig = function(key) {
  var temp = {};
  temp = Object.assign(LS, temp);
  temp.entry.push(key);
  return temp;
};

utils.createScriptTag = function(src) {
  return `<script type="text/javascript" src="${src}"></script>`;
};

utils.appendScriptTag = function(code) {
  return `<script type="text/javascript">${code}</script>`;
};

utils.createStyleTag = function(src) {
  return `<link rel="stylesheet" href="${src}" />`;
};

utils.createConfig = function(config) {
  return `window._LSOffline_ = ${JSON.stringify(config)};`;
};

utils.createClient = function(kit) {
  return `${kit}`;
};

utils.createKit = function(options) {
  return `var _clientKit_ = new _client_(${options});`;
};
