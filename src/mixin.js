(function(root){
	function createMixin(dest, source) {
		return function() {
			for (var key in source) {
				this[key] = source[key].bind(dest);
			}
			return this;
		}
	}

	function mixin(destination, source) {
		return createMixin(destination, source).call(destination.prototype);
	}

	if (root.Pony) {
		root.Pony.mixin = mixin;
	} else {
		root.mixin = mixin;
	}
})(this);