var utils = module.exports;

var LS = {
  page: '',
  version: '',
  entry: {}
};

utils.initConfig = function(page, version, key, value) {
  if (!version) {
    version = '0.0.0';
  }

  var temp = {};
  temp = Object.assign(LS, temp);
  temp.page = page;
  temp.version = version;
  temp.entry[key] = value;
  return temp;
};

utils.createScriptTag = function(src) {
  return `<script type="text/javascript" src="${src}"></script>`;
};

utils.createStyleTag = function(src) {
  return `<link rel="stylesheet" href="${src}" />`;
};

utils.createConfig = function(config) {
  return `<script type="text/javascript">window.__LS__ = ${JSON.stringify(config)}</script>`;
};

utils.createClient = function(kit) {
  if (typeof type === 'undefined') {
    type = true;
  }
  return `<script type="text/javascript">${kit}</script>`;
};

utils.createKit = function() {
  return `<script type="text/javascript">var __clientKit__ = new __client__();</script>`;
};

utils.createRunner = function() {
  return `<script type="text/javascript">__clientKit__.runLoader()</script>`;
};