var utils = module.exports

var LS = {
  version: '',
  entry: {}
};

utils.initConfig = function(version, key, value) {
  if (!version) {
    version = '0.0.0';
  }
  var temp = {}
  temp = Object.assign(LS, temp)
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

utils.createClient = function(kit, funName, type) {
  if (typeof type === 'undefined') {
    type = true;
  }
  return `<script type="text/javascript">${kit}</script><script type="text/javascript">${funName}('${type}')</script>`;
};