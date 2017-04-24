function _client_(options) {
  this.options = options;
  this.entry = window._LSOffline_.entry;

  this.lib = {
    length: 0
  };

  this.runLoader()
}

_client_.prototype = {
  storage: {
    modify: function(key) {
      return key;
    },
    check: function(key) {
      return window.localStorage.hasOwnProperty(this.modify(key));
    },
    get: function(key) {
      try {
        return window.localStorage.getItem(this.modify(key));
      } catch(error) {
        throw new Error(error);
      }
    },
    set: function(key, value) {
      try {
        window.localStorage.setItem(this.modify(key), value)
      } catch(error) {
        throw new Error(error);
      }
    },
    remove: function(key) {
      try {
        window.localStorage.removeItem(this.modify(key))
      } catch(error) {
        throw new Error(error)
      }
    }
  },
  requestJS: function(params, callback, fallback){
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
  },
  createLoad: function(key) {
    var self = this;

    self.getResource(key, function(code) {
      self.runTogether(key, code);
    }, function(params, error) {
      self.appendScriptTag('', params.path);
      throw new Error(error);
    })
  },
  getResource: function(key, callback, fallback) {
    var self = this;

    if (!self.storage.check(key) || !self.options.cache) {
      self.requestJS({
        key: key,
        path: key
      }, function(params, response) {
        self.storage.set(params.key, response);

        callback(response);
      }, function(params, error) {
        fallback(params, error);
      })
    } else {
      callback(self.storage.get(key));
    }
  },
  runTogether: function(key, code) {
    var self = this;

    self.lib[key] = code;
    self.lib.length += 1;

    if (self.lib.length === self.entry.length) {
      for (var i = 0; i < self.entry.length; i++) {
        var item = self.entry[i];
        self.appendScriptTag(self.lib[item]);
      }
    }
  },
  appendScriptTag: function(code, src) {
    var script = document.createElement('script');

    if (src) {
      script.src = src;
    }

    if (code) {
      script.appendChild(document.createTextNode(code));
    }

    document.head.appendChild(script);
  },
  runLoader: function() {
    var self = this;

    for (var i = 0; i < self.entry.length; i++) {
      self.createLoad(self.entry[i]);
    }
  }
};