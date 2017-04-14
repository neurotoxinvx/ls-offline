module.exports = function __clientKit__() {
  var __VERSION__ = '__LS_VERSION__'

  var getLocalStorage = function(key) {
    try {
      return window.localStorage[key]
    } catch(e) {
      throw new Error(e)
    }
  }

  var setLocalStorage = function(key, value) {
    try {
      window.localStorage[key] = value
    } catch(e) {
      throw new Error(e)
    }
  }

  var requestJS = function(path, jsname, callback){
    try{
      var xhr = new XMLHttpRequest();
      xhr.open("get", path, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
          if((xhr.status >=200 && xhr.status < 300 ) || xhr.status == 304){
            if(xhr.response!=''){
              callback(path, jsname, xhr.response);
            }
          }
        }
      };
      xhr.send(null);
    } catch (e){
      throw new Error(e)
    }
  };

  var createScript = function(key, source, isNew) {
    var script = document.createElement('script');

    if (isNew) {
      requestJS(source, key, function(path, key, response) {
        source = response
        var code = '!function(){' + source + '\n}();';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);

        setLocalStorage(__VERSION__, window.__LS__.version)
        setLocalStorage(key, response)
      })
    } else {
      source = getLocalStorage(key)
      var code = '!function(){' + source + '\n}();';
      script.appendChild(document.createTextNode(code));
      document.head.appendChild(script);
    }
  }

  var runLoader = function() {
    var version = getLocalStorage(__VERSION__)
    var app = window.__LS__.entry

    var keys = Object.keys(app)

    keys.forEach(function(key) {
      createScript(`__LS_${key.toUpperCase()}__`, app[key], version !== window.__LS__.version)
    })
  }

  runLoader()
}
