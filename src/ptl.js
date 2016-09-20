(function(root){

  if (!root.Pony) {
    throw new Error("PTL cannot be used without Pony.JS core");
  }
	
  function Ptl(pathOrObject, parent, context) {
    if (typeof(pathOrObject) === 'object') {
      this.template = pathOrObject;
    }
    this.templatePath = pathOrObject;
    this.onError = function(err) { console.error(err); };
    this.delegates = {};
    this.delegateHandlers = {};
    this.signals = {};
    this.pony = null;
    this.parent = parent;
    this.context = context;
  }
  
  Ptl.prototype.loadJson = function(callback) {   
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
  
  Ptl.prototype.generateEl = function(obj, parent) {
    var pony = null;
    if (!obj.pony) {
      var tag = obj.tag || obj.type || 'div';
      obj.attributes = obj.attributes || {};
      for (var key in obj.attributes) {
        var ref = obj.attributes[key].reference;
        if (ref) {
          obj.attributes[key] = this.context[ref];
        }
      }
      pony = root.Pony.el(tag, obj.attributes, obj.text, parent);
    } else {
      if (!root.Pony.Shedrow) {
        throw new Error("Cannot use advanced pony elements without Shedrow-Library loaded");
      }
      if (!root.Pony.Shedrow[obj.pony]) {
        throw new Error("Unknown Pony " + obj.pony);
      }
      pony = new root.Pony.Shedrow[obj.pony](obj.attributes, this.generateHead(pony, obj.head), parent);
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
        var child = this.generateEl(obj.children[key], pony);
        this[key] = child;
      }
    }
    return pony;
  };
  
  Ptl.prototype.failed = function(callback) {
    this.onError = callback;
    return this;
  }
  
  Ptl.prototype.load = function(callback) {
    this.loadJson(function(data) {
      try {
        this.pony = this.generateEl(data, this.parent);
        return callback(this);
      } catch (ex) {
        this.onError(ex);
      } 
    }.bind(this));
    return this;
  }
  
  Ptl.prototype.render = function(parent) {
    this.pony = this.generateEl(this.template, parent || this.parent);
    return this;
  }

  root.Pony.Ptl = Ptl;
})(this);