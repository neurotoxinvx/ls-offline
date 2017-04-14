var utils = module.exports

var LS = {
  version: '',
  entry: {}
}

utils.createConfig = function(version, key, value) {
  var temp = {}
  temp = Object.assign(LS, temp)
  temp.version = version
  temp.entry[key] = value
  return temp
}

utils.createScriptTag = function(src) {
  return `<script type="text/javascript" src="${src}"></script>`
}

utils.createStyleTag = function(src) {
  return `<link rel="stylesheet" href="${src}" />`
}

utils.concatConfig = function(config) {
  return `<script type="text/javascript">window.__LS__ = ${JSON.stringify(config)}</script>`
}

utils.concatClientKit = function(kit, funName) {
  return `<script type="text/javascript">${kit}</script><script type="text/javascript">${funName}()</script>`
}