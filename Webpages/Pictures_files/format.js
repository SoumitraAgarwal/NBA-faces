/**
 * This is the NBA Membership Format namespace.
 * This will handle all formatting functionality.
 * @namespace _nba.membership.format
 * @memberof! <global>
 */

;(function _MembershipFormatInitWrapper(namespace,subNamespace,format,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	w[namespace][subNamespace][format] = w[namespace][subNamespace][format] ||
	(function _MembershipFormatInit(w,d,undefined) {
		var my = {},
		type = "membership.format";

		function gender(val) {
			var gender;

			if (val) {
				switch (val.toLowerCase()) {
					case "m":
					case "male":
						gender = "M";
					break;
					case "f":
					case "female":
						gender = "F";
					break;
					default:
						gender = "O";
				};
				return gender;
			} else {
				return undefined;
			}
		}

		my.gender = gender;

		/* This is where you return all of your public methods. */
		return my;

	}(w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","format",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));