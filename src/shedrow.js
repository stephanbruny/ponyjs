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

	function PonyTable(attributes, head, data) {
		this.head = head;
		this.base = new root.Pony.el('table', attributes);
		this.thead = this.base.appendNew('thead');
		this.tbody = this.base.appendNew('tbody');
		this.data = data || [];
		var headRow = this.thead.appendNew('tr');
		for (var key in head) {
			var th = _createTableHeader(head[key], this);
			headRow.append(th);
		}
	}

	function PonyList(type, attributes, delegate) {
		var base = new root.Pony.el('type', attributes);
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

	root.Pony.Shedrow = {
		Table: PonyTable,
		List: PonyList
	};
})(this);
