(function(root){

  if (!root.Pony) {
    throw new Error("PTL cannot be used without Pony.JS core");
  }
	
  function Ptl(pathOrObject) {
    if (typeof(pathOrObject) === 'object') {
      this.template = pathOrObject;
    }
    this.templatePath = pathOrObject;
    this.onError = function(err) { console.error(err); };
    this.delegates = {};
    this.delegateHandlers = {};
    this.signals = {};
    this.pony = null;
  }
  
  Ptl.prototype.loadJSON = function(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', this.templatePath, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        try {
          var json = JSON.parse(xobj.responseText);
          callback(json); 
        } catch (ex) {
          this.onError(ex);
        }
      }
    };
    xobj.send(null);
    return this;
  };
  
  Ptl.prototype.generateDelegate = function(name, key) {
    var fn = this.delegates[name];
    return (function() {
      return fn.apply(this.pony, arguments);
    }).bind(this);
  }
  
  Ptl.prototype.generateHeadItem = function(pony, obj) {
    if (!obj.delegate) { 
      return obj;
    }
    var result = {};
    for (var key in obj) {
      result[key] = obj[key];
    }
    result.delegate = this.generateDelegate(obj.delegate);
    if (obj.head) {
      result.head = this.generateDelegate(obj.head, 'head');
    }
    return result;
  };
  
  Ptl.prototype.generateHead = function(pony, obj) {
    var result = {};
    for (var key in obj) {
      result[key] = this.generateHeadItem(pony, obj[key]);
    }
    return result;
  }
  
  Ptl.prototype.generateEl = function(obj) {
    if (!obj.pony) {
      var tag = obj.tag || 'div';
      this.pony = new root.Pony.Pony(tag, obj.attributes);
    } else {
      if (!root.Pony.Shedrow) {
        throw new Error("Cannot use advanced pony elements without Shedrow-Library loaded");
      }
      if (!root.Pony.Shedrow[obj.pony]) {
        throw new Error("Unknown Pony " + obj.pony);
      }
      this.pony = new root.Pony.Shedrow[obj.pony](obj.attributes, this.generateHead(pony, obj.head));
    }
    if (obj.signals) {
      if (!root.Pony.Signal) {
        throw new Error("Signals cannot be used without Pony-Signals library loaded");
      }
      for (var key in obj.signals) {
        this.signals[key] = !!obj.signals[key] ? pony.signal(obj.signals[key]) : new Pony.Signal();
      }
    }
    if (obj.children) {
      for (var key in obj.children) {
        this[key] = this.generateEl(obj.children[key]);
      }
    }
    return this;
  };
  
  Ptl.prototype.failed = function(callback) {
    this.onError = callback;
    return this;
  }
  
  Ptl.prototype.load = function(callback) {
    this.loadJson(function(data) {
      console.log(data)
      try {
        return callback(this.generateEl(data));
      } catch (ex) {
        this.onError(ex);
      } 
    });
    return this;
  }
  
  Ptl.prototype.render = function() {
    return this.generateEl(this.template);
  }

  root.Pony.Ptl = Ptl;
})(this);