function _client_(options) {
  this.options = options;
  this.entry = window._LSOffline_.entry;

  this.queue = []

  this.runLoader()
}

_client_.prototype = {
  storage: {
    canIUse: function () {
      try {
        var testKey = '_storageTest_'
        this.set(testKey, testKey)

        if (this.get(testKey) !== testKey) {
          this.storageDisable = true;
          return
        }

        this.remove(testKey)
      } catch (e) {
        this.storageDisable = true;
      }
    },
    modify: function(key) {
      return key;
    },
    check: function(key) {
      if (this.storageDisable) {
        return false
      }
      return window.localStorage.hasOwnProperty(this.modify(key));
    },
    get: function(key) {
      if (this.storageDisable) {
        return false
      }

      return window.localStorage.getItem(this.modify(key));
    },
    set: function(key, value) {
      if (this.storageDisable) {
        return false
      }

      window.localStorage.setItem(this.modify(key), value)
    },
    remove: function(key) {
      if (this.storageDisable) {
        return false
      }

      window.localStorage.removeItem(this.modify(key))
    }
  },
  requestJS: function(params, callback, fallback){
    try{
      var xhr = new XMLHttpRequest();

      xhr.open("GET", params.path, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
          if((xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 304){
            if(!!xhr.response){
              callback(params, xhr.response);
            }
          }
        }
      };

      xhr.send(null);
    } catch (error){
      fallback(params, error);
    }
  },
  createLoad: function(key) {
    var self = this;

    self.queue.push({key: key, code: '', status: 'loading'});

    self.getResource(key, function(code) {
      self.runQueue(key, code);
    }, function(params, error) {
      console.log(params.path + ' can not load, because: ' + JSON.stringify(error));
    })
  },
  getResource: function(key, callback, fallback) {
    var self = this;

    if (!self.storage.check(key) || !self.options.cache) {
      self.requestJS({
        key: key,
        path: key
      }, function(params, response) {
        callback(response);

        self.storage.set(params.key, response);
      }, function(params, error) {
        fallback(params, error);
      })
    } else {
      callback(self.storage.get(key));
    }
  },
  runQueue: function(key, code) {
    var self = this;

    if (!!key && !!code) {
      for (var k in self.queue) {
        if (self.queue[k].key === key) {
          self.queue[k].code = code;
          self.queue[k].status = 'loaded';
        }
      }
    }

    if (!!self.queue[0] && !!self.queue[0].code && self.queue[0].status === 'loaded') {
      self.queue[0].status = 'appending';

      self.appendScriptTag(self.queue[0].code, null, function () {
        self.queue.status = 'appended';
        self.queue.shift();

        if (self.queue.length > 0) {
          self.runQueue();
        }
      });
    }
  },
  appendScriptTag: function(code, src, loadedCallBack) {
    var script = document.createElement('script');

    if (src) {
      script.src = src;
      script.onload = loadedCallBack;
    }

    if (code) {
      script.appendChild(document.createTextNode(code));
    }

    document.head.appendChild(script);
  },
  runLoader: function() {
    var self = this;

    this.storage.canIUse();

    for (var i = 0; i < self.entry.length; i++) {
      self.createLoad(self.entry[i]);
    }
  }
};