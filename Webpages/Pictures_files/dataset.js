;(function _initDatasetPolyfill() {

	// only add support if the browser doesn't support data-* natively
	if (document.body.dataset != undefined) return;

	var forEach = [].forEach,
		regex = /^data-(.+)/,
		dashChar = /\-([a-z])/ig,
		mutationSupported = false,
		match;

	function toCamelCase(s) {
		return s.replace(dashChar, function (m,l) { return l.toUpperCase(); });
	}

	function updateDataset() {
		var dataset = {};
		forEach.call(this.attributes, function(attr) {
			if (match = attr.name.match(regex))
				dataset[toCamelCase(match[1])] = attr.value;
		});
		return dataset;
	}

	function defineElementGetter (obj, prop, getter) {
		if (Object.defineProperty) {
				Object.defineProperty(obj, prop,{
						get : getter
				});
		} else {
				obj.__defineGetter__(prop, getter);
		}
	}

	defineElementGetter(Element.prototype, 'dataset', updateDataset);
})();
