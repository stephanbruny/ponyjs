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
			this.connections[i].apply(this, arguments);
		}
	};
