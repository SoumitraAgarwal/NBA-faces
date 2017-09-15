/**
 * @author 	Maxime Haineault (max@centdessin.com)
 * @version	0.3
 * @desc Modified version of general cookie library.
 * 
 */

;(function(namespace,settings,w,d) {
	//Make sure the "nba" Namespace exists (since this will be on endless other websites, want to namespace all the modules so they don't conflict).
	if (!w[namespace]) {
		w[namespace] = {};
	}
	if (!w[namespace][settings]) {
		w[namespace][settings] = {};
	}
	w[namespace].cookie = w[namespace].cookie || (function Cookie(w,d,undefined) {
		var my = {};

		/** Get a cookie's value
		 *
		 *  @param integer	key		The token used to create the cookie
		 *  @return void
		 */
		function get(name) {
			var name = name.toLowerCase(),
			crumbles = d.cookie.split(";"),
			len = crumbles.length;

			for(var i=0;i<len;i++) {
				var pair= crumbles[i].split("="),
				key = decodeURIComponent(pair[0].trim().toLowerCase()),
				val = pair.length>1?pair[1]:"";

				if(name == key) {
					return decodeURIComponent(val);
				}
			}
			return "";
		}

		/** Set a cookie
		 *
		 *  @param {object} data - A data object containing all values to be passed in.
		 *  @param {integer} data.key - The token that will be used to retrieve the cookie
		 *  @param {string} data.value - The string to be stored
		 *  @param {integer} data.ttl - Time To Live (hours)
		 *  @param {string} data.path - Path in which the cookie is effective, default is "/" (optional)
		 *  @param {string} data.domain - Domain where the cookie is effective, default is window.location.hostname (optional)
		 *  @param {boolean} data.secure - Use SSL or not, default false (optional)
		 * 
		 *  @return setted cookie
		 */
		function set(data) {
			cookie = [data.key+"="+    escape(data.value),
					"path="+    ((!data.path   || data.path=='')  ? "/" : data.path),
					"domain="+  ((!data.domain || data.domain=='')?  w.location.hostname : data.domain)];
			if (data.hasOwnProperty("ttl"))	cookie.push("max-age=" + hoursToSeconds(data.ttl));
			if (data.hasOwnProperty("ttl"))	cookie.push("expires=" + hoursToExpireDate(data.ttl)); /* Needed for IE8 and below.  Anything newer will use max-age. */
			if (data.secure)	cookie.push('secure');
			return d.cookie = cookie.join('; ');
		}

		/** Unset a cookie
		 *
		 *  @param {object} data - A data object containing all values to be passed in.
		 *  @param {integer} data.key - The token that will be used to retrieve the cookie
		 *  @param {string} data.path - Path used to create the cookie (optional)
		 *  @param {string} data.domain - Domain used to create the cookie, default is null (optional)
		 *  @return void
		 */
		function unset(data) {
			data.path   = (!data.path   || typeof data.path   != 'string') ? '' : data.path;
			data.domain = (!data.domain || typeof data.domain != 'string') ? '' : data.domain;
			if (get(data.key)) set({key:data.key, ttl:0, path:data.path, domain:data.domain});
		}

		/** Return GTM date string of "now" + time to live
		 *
		 *  @param {integer} ttl - Time To Live (hours)
		 *  @return string
		 */
		function hoursToExpireDate(ttl) {
			if (parseInt(ttl) == 'NaN' ) return '';
			else {
				now = new Date();
				now.setTime(now.getTime() + (parseInt(ttl) * 60 * 60 * 1000));
				return now.toGMTString();
			}
		}

		/** Return the number of seconds until expiration.
		 *
		 *  @param {integer} ttl - Time To Live (hours)
		 *  @return integer
		 */
		function hoursToSeconds(ttl) {
			if (parseInt(ttl) == 'NaN' ) return 0;
			else {
				return ((parseInt(ttl)*60)*60);
			}
		}

		my.get = get;
		my.remove = unset;
		my.set = set;
		my.unset = unset;

		return my;
	}(w,
	  d));
}(window.membership_settings.jsNamespace,window.membership_settings.jsSettings,window,document));
