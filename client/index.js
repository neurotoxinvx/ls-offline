function __client__() {
  this.entry = window.__LS__.entry;

  this.keys = [];

  for (var key in this.entry) {
    if (this.entry.hasOwnProperty(key)) {
      this.keys.push(key)
    }
  }

  this.lib = {
    length: 0
  };
}

__client__.prototype = {
  storage: {
    modify: function(key) {
      return '_LS_' + window.__LS__.page.toUpperCase() + '_' + key.toUpperCase() + '_';
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
  createLoad: function(key, source, index, isNew) {
    var self = this;

    self.getResource(key, source, isNew, function(code) {
      self.runTogether(key, code);
    }, function(params, error) {
      self.appendScriptTag('', params.path);
      throw new Error(error);
    })
  },
  getResource: function(key, source, isNew, callback, fallback) {
    var self = this;

    if (!self.storage.check(key) || isNew) {
      self.requestJS({
        key: key,
        path: source
      }, function(params, response) {
        self.storage.set('version', window.__LS__.version);
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

    if (self.lib.length === self.keys.length) {
      self.keys.forEach(function(item) {
        self.appendScriptTag(self.lib[item])
      })
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
    var version = self.storage.get('version');

    self.keys.forEach(function(key, index) {
      self.createLoad(key, self.entry[key], index, version !== window.__LS__.version);
    })
  }
};