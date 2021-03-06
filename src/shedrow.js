(function(root) {
	if (!root.Pony) {
		throw new Error("Pony.js Core missing or not loaded");
	}

	function _createTableHeader(headItem, table) {
		var th = new root.Pony.el('th', {});
		if (headItem.head) {
			th.append(headItem.head(table));
		} else {
			th.appendNew('span', {}, headItem.title);
		}
		return th;
	}

	function PonyTable(attributes, head, parent) {
		this.head = head;
		this.base = new root.Pony.el('table', attributes, null, parent);
		this.thead = this.base.appendNew('thead');
		this.tbody = this.base.appendNew('tbody');
		this.data = [];
		var headRow = this.thead.appendNew('tr');
		for (var key in head) {
			var th = _createTableHeader(head[key], this);
			headRow.append(th);
		}
	}

	function PonyList(type, attributes, delegate) {
		var base = new root.Pony.el(type, attributes);
		this.base = base;
		this.delegate = delegate || function(item) {
			return base.appendNew('li', {}, item);
		};
	}

	PonyList.prototype.display = function(data, options) {
		for (var i = 0; i < data.length; i++) {
			this.base.append(this.delegate(data[i], options));
		}
	};

	PonyTable.prototype.display = function(data, options) {
		if (!Array.isArray(data)) { throw new Error("Table data must be an array") };
		this.tbody.clear();
		for (var i = 0; i < data.length; i++) {
			var tr = this.tbody.appendNew('tr');
			for (var key in this.head) {
				var td = tr.appendNew('td');
				if (this.head[key].delegate) {
					td.append(this.head[key].delegate(data[i], options));
				} else {
					td.el.appendChild(document.createTextNode((data[i][key])));
				}
			}
		}
	};
	
	Pony.Pony.prototype.serialize = function() {
		var elements = Array.prototype.slice.call(this.el.querySelectorAll('input,select,textarea,select'));
		var result = {};
		for (var i = 0; i < elements.length; i++) {
			var name = elements[i].getAttribute('name');
			var val = elements[i].value;
			if (!val) continue;
			if (elements[i].getAttribute('type') === 'checkbox') {
				val = !!elements[i].checked;
			}
			if (elements[i].getAttribute('type') === 'number') {
				val = parseFloat(elements[i].value);
			}
			
			if (result[name]) {
				if (!Array.isArray(result[name])) {
					result[name] = [result[name]];
				}
				result[name].push(val);
				continue;
			}
			result[name] = val;
		}
		return result;
	}

	Pony.Pony.prototype.getInputElements = function() {
		return Array.prototype.slice.call(this.el.querySelectorAll('input,select,textarea'));
	}

	function fillInput(el, value) {
		switch (el.tagName.toLowerCase()) {
			case 'input': {
				var type = el.getAttribute('type');
				if (type === 'checkbox') return (Boolean(value)) ? el.setAttribute('checked', 'checked') : el.removeAttribute('checked');
				break;
			};
			case 'textarea': {
				el.innerHTML = value;
				break;
			};
			default: break;
		}
		return el.value = value;
	}

	Pony.Pony.prototype.fill = function(data) {
		var elements = this.getInputElements();
		for (var i = 0; i < elements.length; i++) {
			var name = elements[i].getAttribute('name');
			if (data[name]) {
				fillInput(elements[i], data[name]);
			}
		}
	}

	Pony.Pony.prototype.disableAll = function(disabled) {
		var elements = this.getInputElements();
		for (var i = 0; i < elements.length; i++) {
			if (!disabled) elements[i].removeAttribute('disabled');
			else elements[i].setAttribute('disabled', 'disabled');
		}
	}

	root.Pony.Shedrow = {
		Table: PonyTable,
		List: PonyList
	};
})(this);
