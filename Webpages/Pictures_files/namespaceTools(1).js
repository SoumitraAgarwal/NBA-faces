;(function(namespace,settings,w,d) {

	if (!w[namespace]) {
		w[namespace] = {};
	}
	if (!w[namespace][settings]) {
		w[namespace][settings] = {};
	}
	if (!w[namespace].namespaceTools) {
		w[namespace].namespaceTools = w._nbaNamespaceTools = (function NamespaceTools(w,d,undefined) {
			var my = {},
			type = "NamespaceTools";

			my.safeCreate = function _safeCreate(namespaceChain) {
				if (namespaceChain) {
					if (namespaceChain instanceof Array) {
						var namespaces = namespaceChain;
					} else if (namespaceChain.indexOf(".")!=-1) {
						var namespaces = namespaceChain.split(".");
					}
					if (namespaces) {
						var nsCount = namespaces.length,
						currNs = w;

						for (var i=0;i<nsCount;i++) {
							if (!currNs[namespaces[i]]) {
								currNs = currNs[namespaces[i]] = {};
							} else {
								currNs = currNs[namespaces[i]];
							}
						}
						currNs = w;
					} else {
						if (!w[namespaceChain]) {
							w[namespaceChain] = {};
						}
					}
				}
			}

			return my;
		}(w,
		  d));
	}
}(window.membership_settings.jsNamespace,window.membership_settings.jsSettings,window,document));