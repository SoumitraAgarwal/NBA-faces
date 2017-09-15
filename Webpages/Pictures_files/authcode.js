/**
 * This is the NBA Membership Authcode namespace.
 * This will handle all base membership functionality.
 * @namespace _nba.membership.authcode
 * @memberof! <global>
 */

;(function _MembershipAuthcodeInitWrapper(namespace,subNamespace,authcode,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	w[namespace][subNamespace][authcode] = w[namespace][subNamespace][authcode] ||
	(function _MembershipAuthcodeInit(storage,cookie,w,d,undefined) {
		var my = {},
		currAuthcode = "",
		data = {},
		initialized = false,
		type = "membership.authcode";

		/* Everything related to the authcode */
		function get() {
			return (currAuthcode || undefined);
		}

		function remove() {
			currAuthcode = "";
			return true;
		}

		function set(code) {
			if (code) {
				currAuthcode = code;
				return true;
			} else {
				return false;
			}
		}

		/* Everything related to the authcode */
		my.get = get;
		my.remove = remove;
		my.set = set;

		/* This is where you return all of your public methods. */
		return my;

	}(w[namespace].storage,
	  w[namespace].cookie,
	  w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","authcode",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));