(function(root) {
	function Signal(pony, domEvent) {
		this.connections = [];
		if (domEvent) {
			pony.el[domEvent] = this.emit.bind(this);
		}
	}

	Signal.prototype.connect = function(cb) {
		this.connections.push(cb);
	};

	Signal.prototype.emit = function() {
		for (var i = 0; i < this.connections.length; i++) {
			var result = this.connections[i].apply(this, arguments);
			if (result === false) {
				this.connections.splice(i, 1);
			}
		}
		return false;
	};

	root.Pony.Pony.prototype.signal = function(domEvent) {
		return new Signal(this, domEvent);
	};

	if (root.Pony) {
		root.Pony.Signal = Signal;
	} else {
		root.Signal = Signal;
	}

})(this);