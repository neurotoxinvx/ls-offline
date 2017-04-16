module.exports = function __client__(type) {
  var VERSION = '__LS_VERSION__';
  var entry = window.__LS__.entry;
  var keys = [];

  for (var key in entry) {
    if (entry.hasOwnProperty(key)) {
      keys.push(key)
    }
  }
  var lib = {
    length: 0
  };

  var storage = {
    check: function(key) {
      return window.localStorage.hasOwnProperty(key)
    },
    get: function(key) {
      try {
        return window.localStorage.getItem(key);
      } catch(error) {
        throw new Error(error);
      }
    },
    set: function(key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch(error) {
        throw new Error(error);
      }
    },
    remove: function(key) {
      try {
        window.localStorage.removeItem(key)
      } catch(error) {
        throw new Error(error)
      }
    }
  };

  var requestJS = function(params, callback, fallback){
    try{
      var xhr = new XMLHttpRequest();
      xhr.open("get", params.path, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
          if((xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 304){
            if(xhr.response != ''){
              callback(params, xhr.response);
            }
          }
        }
      };
      xhr.send(null);
    } catch (error){
      fallback(params, error);
      throw new Error(error);
    }
  };

  var createLoad = function(key, source, index, isNew) {
    getResource(key, source, isNew, function(code) {
      runTogether(key, code)
    }, function(params, error) {
      console.log(params, error);
    })
  };

  var getResource = function(key, source, isNew, callback, fallback) {
    key = '__LS_' + key.toUpperCase() + '__';

    if (!storage.check(key) || isNew) {
      requestJS({
        key: key,
        path: source
      }, function(params, response) {
        storage.set(VERSION, window.__LS__.version);
        storage.set(params.key, response);

        callback(response);
      }, function(params, error) {
        fallback(params, error);
      })
    } else {
      callback(storage.get(key));
    }
  };

  var runTogether = function(key, code) {
    lib[key] = code;
    lib.length += 1;

    if (lib.length === keys.length) {
      keys.forEach(function(item) {
        appendScriptTag(lib[item])
      })
    }
  };

  var appendScriptTag = function(code) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(code));
    document.head.appendChild(script);
  };

  var runLoader = function(type) {
    var version = storage.get(VERSION);

    if (type === 'cleaner') {
      version = 'cleaner';
    }

    keys.forEach(function(key, index) {
      createLoad(key, entry[key], index, version !== window.__LS__.version);
    })
  };

  runLoader(type);
};