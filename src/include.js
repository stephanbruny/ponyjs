(function(root) {
	var _includes = {};
	var scriptTags = document.querySelectorAll('script[src]');
	for (var i = 0; i < scriptTags.length; i++) {
		_includes[scriptTags[i].getAttribute('src')] = scriptTags[i];
	}

	function include(name, callback) {
		if (_includes[name]) {
			return callback ? callback(_includes[name]) : _includes[name];
		}
		var script = document.createElement('script')
		script.src = name;
		if (callback) script.onload = script.onerror = script.onreadystatechange = callback;
		return (document.head || document.getElementsByTagName('head')[0]).appendChild(script);
	}

	if (root.Pony) {
		root.Pony.include = include;
	} else {
		root.include = include;
	}
})(this);