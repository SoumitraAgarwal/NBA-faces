/*!
 * _nba.storage - Simple storage lib with no dependencies
*/

;(function(namespace,subNamespace,settings,w,d) {
	"use strict";
	//Make sure the "nba" Namespace exists (since this will be on endless other websites, want to namespace all the modules so they don't conflict).
	if (!w[namespace]) {
		w[namespace] = {};
	}
	w[namespace][subNamespace] = w[namespace][subNamespace] || (function Storage(w,d,undefined) {
		var my = {},
		backupStorage = {},
		backupCookieName = "nbaBackupStorage",
		testVar = "nbaTestAvailable",
		localAvailable = true,
		sessionAvailable = true;

		/* Initialize this module */
		(function init() {
			if (!checkStorageAvailable("localStorage")) {
				localAvailable = false;
			}
			if (!checkStorageAvailable("sessionStorage")) {
				sessionAvailable = false;
			}
		}());

		function checkStorageAvailable(version) {
			try {
				w[version].setItem(testVar,"1");
				w[version].removeItem(testVar);
				return true;
			} catch(e) {
				return false;
			}
		}

		function getCookie(name) {
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

		function getItem(version,key) {
			var value,
			cookie,
			cookieObj;

			if (typeof(w[version]) !== "undefined") {

				if (isStorageAvailable(version)) {
					value = w[version].getItem(key);
				} else {
					cookie = getCookie(backupCookieName);
					if (cookie) {
						cookieObj = w.JSON.parse(cookie);
						backupStorage = cookieObj;
					}
					value = backupStorage[key];
				}

				try {
					return w.JSON.parse(value);
				} catch (e2) {
					return value;
				}
			}
		}

		function getLocalItem(key) {
			return getItem("localStorage",key);
		}

		function getSessionItem(key) {
			return getItem("sessionStorage",key);
		}

		function isPlain(val) {
			return (typeof val === "undefined" || typeof val === "string" || typeof val === "boolean" || typeof val === "number" || Array.isArray(val) || val === null);
		}

		function isStorageAvailable(version) {
			if (version == "localStorage") {
				return localAvailable;
			} else if(version == "sessionStorage") {
				return sessionAvailable;
			} else {
				return sessionAvailable;
			}
		}

		function removeItem(version,key) {
			var value;

			if (typeof(w[version]) !== "undefined") {

				if (isStorageAvailable(version)) {
					w[version].removeItem(key);
				} else {
					delete backupStorage[key];
					setCookie();
				}

			}
		}

		function removeLocalItem(key) {
			return removeItem("localStorage",key);
		}

		function removeSessionItem(key) {
			return removeItem("sessionStorage",key);
		}

		function setCookie() {
			d.cookie = backupCookieName+"="+escape(w.JSON.stringify(backupStorage))+";path=/;domain="+w.location.hostname;
		}

		function setItem(version,key,value) {
			var val;

			if (typeof(w[version]) !== "undefined") {

				if (!value) {
					val = false;
				} else if (!isPlain(value)) {
					try {
						val = w.JSON.stringify(value);
					} catch (e) {
						val = (value || false);
					}
				} else {
					val = (value || false);
				}

				if (isStorageAvailable(version)) {
					w[version].setItem(key, val);
				} else {
					backupStorage[key] = val;
					setCookie();
				}
			}
		}

		function setLocalItem(key,value) {
			return setItem("localStorage",key, value);
		}

		function setSessionItem(key, value) {
			return setItem("sessionStorage",key, value);
		}

		my.getLocalItem = getLocalItem;
		my.getSessionItem = getSessionItem;
		my.isPlain = isPlain;
		my.isStorageAvailable = isStorageAvailable;
		my.local = {
				get:getLocalItem,
				remove:removeLocalItem,
				set:setLocalItem
			};
		my.removeLocalItem = removeLocalItem;
		my.removeSessionItem = removeSessionItem;
		my.setLocalItem = setLocalItem;
		my.setSessionItem = setSessionItem;
		my.session = {
				get:getSessionItem,
				remove:removeSessionItem,
				set:setSessionItem
			};

		return my;
	}(w,
	  d));
}(window.membership_settings.jsNamespace,"storage",window.membership_settings.jsSettings,window,document));
