(function(root) {
  
  var _rpcId = 0;
  
  function PonyRpc(method, params) {
    this.requestData = {
      jsonrpc: '2.0',
      id: '_rpc_' + (_rpcId++).toString(),
      method: method,
      params: params
    }
    this.xhr = new XMLHttpRequest();
    
    this.onResponse = function() {
      throw new Error("RPC Request sent without response callback");
    }
    
    this.onError = function(err) {
      console.error(err.message || err.error || err);
    }
    
    this.xhr.open("POST", '/');
    this.xhr.setRequestHeader("Content-type", "application/json");
    //.bind ensures that this inside of the function is the XHR object.
    this.xhr.onreadystatechange = (function() {
      try {
        if (this.xhr.readyState === 4) {
          var res = JSON.parse(this.xhr.responseText);
          if (!!res.error) {
            return this.onError(res.error);
          }
          this.onResponse(res.result);
        }
      } catch (ex) {
        this.onError(ex);
      }
    }).bind(this);
  }
  
  PonyRpc.prototype.timeout = function(msec) {
    this.xhr.timeout = msec;
    return this;
  }
  
  PonyRpc.prototype.response = function(callback) {
    this.onResponse = callback;
    return this;
  }
  
  PonyRpc.prototype.error = function(callback) {
    this.onError = callback;
    return this;
  }
  
  PonyRpc.prototype.send = function() {
    this.xhr.send(JSON.stringify(this.requestData));
    return this;
  }
  
  if (root.Pony) {
		root.Pony.Rpc = PonyRpc;
	} else {
		root.Rpc = PonyRpc;
	}
})(this);