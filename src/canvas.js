(function(root) {


	var _includes = {};
	var scriptTags = document.querySelectorAll('script[src]');
	for (var i = 0; i < scriptTags.length; i++) {
		_includes[scriptTags[i].getAttribute('src')] = scriptTags[i];
	}

	function Canvas() {
	}

	if (root.Pony) {
		root.Pony.Canvas = Canvas;
	} else {
		root.Canvas = Canvas;
	}
})(this);