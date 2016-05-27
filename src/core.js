(function(root) {
	if (!document) {
		throw new Error("No HTML document found");
	}
	function create(tag, attributes, inner) {
    var result = document.createElement(tag);
    if (attributes) {
      for (var key in attributes) {
        result.setAttribute(key, attributes[key]);
      }
    }
    if (inner) result.innerHTML = inner;
    return result;
  }

	function Pony(el, parent, signals) {
		this.el = el || document.body;
		this.parent = parent || null;
		this.signals = signals || {};
		if (this.parent) {
			this.parent.el.appendChild(this.el);
		}
		if (el.childNodes) {
			for (var i = 0; i < el.childNodes.length; i++) {
				var child = new Pony(el.childNodes[i], null);
				child.setParent(this);
			}
		}
	}

	function PonyEl(tag, attributes, inner, parent) {
		var result = new Pony(create(tag, attributes, inner), parent);
		if (!parent) {
			document.body.appendChild(result.el);
		}
		return result;
	}

	Pony.prototype.setParent = function(parent) {
		this.parent = parent;
		return this;
	};

	Pony.prototype.isPony = function() {
		return true;
	};

	Pony.prototype.find = function(query) {
		return this.el.querySelector(query);
	};

	Pony.prototype.findAll = function(query) {
		return this.el.querySelectorAll(query);
	};

	Pony.prototype.appendNew = function(tag, attributes, inner) {
		var childEl = PonyEl(tag, attributes, inner, this);
		return childEl;
	};

	Pony.prototype._append = function(child) {
		if (!!child.parent) {
			throw new Error("Cannot append child which already has a parent");
		}
		if (child.isPony && child.isPony()) {
			child.setParent(this);
			this.el.appendChild(child.el);
		} else {
			throw new Error("Cannot append child not derived from Pony");
		}
		return this;
	};

	Pony.prototype.append = function(el) {
		if (Array.isArray(el)) {
			for (var i = 0; i < el.length; i++) {
				this._append(el[i]);
			}
			return this;
		}
		return this._append(el);
	};

	Pony.prototype.attribute = function(key, value) {
		if (!value) {
			return this.el.getAttribute(key);
		}
		return this.el.setAttribute(key, value);
	};

	Pony.prototype.text = function(value) {
		if (!value) {
			return this.el.innerHTML;
		}
		this.el.innerHTML = value;
	};

	Pony.prototype.remove = function() {
		this.el.remove();
	};

	Pony.prototype.clear = function() {
		while (this.el.firstChild) {
			this.el.removeChild(this.el.firstChild);
		}
	};

	root.Pony = {
		create: create,
		el: PonyEl,
		Pony: Pony,
		wrap: function(el, parent) {
			return new Pony(el, parent);
		}
	};

})(this);
