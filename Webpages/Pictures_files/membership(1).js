/**
 * This is the NBA Membership namespace.
 * This will handle all base membership functionality.
 * @namespace _nba.membership
 * @memberof! <global>
 */

;(function _MembershipInit(namespace,subNamespace,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,settings,subNamespace]);
	}

	w[namespace][subNamespace] = w[namespace][subNamespace] ||
	(function _membership(s,cookie,querystring,storage,pubsub,gl,w,d,undefined) {
		var my = {
			newsletter:{}
		},
		cookieData = {},
		flags = {
			ssoCheckProcessing:false
		},
		globals = {
			processing:{
				submitButton:"",
				userData:false
			}
		},
		initialized = false,
		type = "membership", /* Type should be the new namespace name. */
		logger = gl.getInstance(type.toLowerCase()); /* Set a logger instance for this namespace. */

		/* Initialize the module. */
		(function init() {
			if (!initialized) {
				logger.log("Initializing.");

				initPubSub();

				/* Store any query params in session storage. */
				storeSessionParams();

				/* Global Form Events */
				initGlobalFormBindings();

				initRegistrationInfo();

				if (w.nbaMembershipReady && nbaMembershipReady.length) {
					for (var i = 0; i < nbaMembershipReady.length; i++) {
						w[nbaMembershipReady[i]]();
					}
				}

				initialized = true;
			} else {
				logger.log("Already initialized.");
			}
			
		}());

		function initGlobalFormBindings() {
			jQuery(togglePasswordDisplay);
			jQuery(highlightCheckbox);
			if (jQuery("#nbaMembership").length) {
				jQuery(toggleStickyFooter);
				jQuery(window).on('resize', toggleStickyFooter);
			}
			jQuery(d).off('mousedown', '.nbaMembershipTogglePassword', togglePasswordDisplay);
			jQuery(d).on('mousedown keypress', '.nbaMembershipTogglePassword', togglePasswordDisplay);
			jQuery(d).on('keyup', '#nbaMembershipDOBWrapper', tabTextBox);
			jQuery(d).on('click', '#nbaMembershipDOBWrapper input', highlightTextBox);
			jQuery(d).on('focus', '.nbaMembershipCheckbox input', highlightCheckbox);
			jQuery(d).on('focus click', "input[type!='checkbox'], button", highlightCheckbox);
		}

		function initRegistrationInfo() {
			var qs = querystring.parse(w.location.search);
			/*Get the Current League */
			if (d.referrer && d.referrer.indexOf("wnba.com") != -1) {
				storage.session.set(window.membership_settings.membershipIdPrefix + "RegistrationLeague","WNBA");
			} else if (!storage.session.get(window.membership_settings.membershipIdPrefix + "RegistrationLeague")) {
				storage.session.set(window.membership_settings.membershipIdPrefix + "RegistrationLeague","NBA");
			}
			if (qs[window.membership_settings.membershipIdPrefix + "RegistrationCode"]) {
				storage.session.set(window.membership_settings.membershipIdPrefix + "RegistrationCode",qs[window.membership_settings.membershipIdPrefix + "RegistrationCode"]);
			}
		}

		function initPubSub() {
			/* Adding logging to all membership messages. */
			pubsub.subscribe(type,logPubSub);

			/* Other PubSub interactions. */
			pubsub.subscribe("membership.clear.storage.start",cleanupStorage);

			pubsub.subscribe("membership.failure",hideProcessing);
			pubsub.subscribe("membership.failure.sso.check",resetSsoCheckFlag);

			pubsub.subscribe("membership.processing.display",displayProcessing);
			pubsub.subscribe("membership.processing.hide",hideProcessing);
			pubsub.subscribe("membership",toggleStickyFooter);

			pubsub.subscribe("membership.unauthorized.sso.check",resetSsoCheckFlag);
		}

		function bindAnchor(params) {
			jQuery(d).on("click", params.elem, params.func);
			jQuery(d).on("keypress", params.elem, function(event) {
				if (event.keyCode === 13) {
					params.func();
				}
			});
			if (params.url) {
				setAnchorLink(jQuery(params.elem)[0],params.url);
			}

		}

		function bindButton(params) {
			jQuery(d).on("click", params.elem, params.func);
			jQuery(d).on("keypress", params.elem, function(event) {
				if (event.keyCode === 13) {
					params.func();
				}
			});
		}

		function cancelForm(type) {
			return function _cancelForm(e) {
				if (e.keyCode !== 9) { // 9 is tab, don't do this if the user is tabbing
					e.preventDefault();
					pubsub.publish("membership.redirect.cancel."+type);
					return false;
				}
			};
		}

		function capitalizeFirst(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function checkAuthcode(req,forcecall) {
			if (my.authcode.get() || forcecall) {
				/* If this is an SSO check and an SSO check is already in flight, cancel this request. */
				if (req.ssoCheck && flags.ssoCheckProcessing) {
					logger.warn("SSO check already in flight...discarding additional SSO check request...");
					return;
				} else if (req.ssoCheck) {
					logger.log("SSO check now in flight...");
					flags.ssoCheckProcessing = true;
				}
				requestData(req);
			} else {
				/* TODO: Though we are gating SSO authorizations to one successful one per page, it may be a good
				 * idea to eventually figure out the best way to unsubscribe all functions once we know the queue
				 * is complete. */
				pubsub.subscribe("membership.authorized",queueRequest(req));
				if (!flags.ssoCheckProcessing) {
					pubsub.publish("membership.check.sso");
				}
			}
		}

		function cleanupStorage(msg, data) {

			if (typeof(data) === "undefined" || data.clearPurcahse === false) {
				cookie.remove({
					key:s.cookie.purchase,
					path:s.cookie.path,
					domain:s.cookie.domain
				});
			}

			cookie.remove({
				key:s.cookie.turnerId,
				path:s.cookie.path,
				domain:s.cookie.domain
			});

			cookie.remove({
				key:s.cookie.authId,
				path:s.cookie.path,
				domain:s.cookie.domain
			});
			// Commented line below to keep the personalize cookie after logout.
			// w.Personalize.reset();
			storage.session.remove(window.membership_settings.membershipIdPrefix + "Teams");
			storage.session.remove(window.membership_settings.membershipIdPrefix + "Players");
			storage.session.remove(window.membership_settings.membershipIdPrefix + "Email");
			my.authcode.remove();

			pubsub.publish("membership.clear.storage.complete");
		}

		function clearAdditionalData() {
			/* This is the one time we want to remove the membership cookie. */
			cookie.remove({
				key:s.cookie.userId,
				path:s.cookie.path,
				domain:s.cookie.domain
			});
		}

		function deleteData(req,forcecall) {
			req.method="DELETE";
			checkAuthcode(req,forcecall);
		}

		function displayProcessing(msg,elem) {
			if (elem) {
				globals.processing.submitButton = elem;
				globals.processing.submitButton.disabled = true;
			} else if (globals.processing.submitButton) {
				globals.processing.submitButton.disabled = true;
			}
			if (d.body.className.indexOf(window.membership_settings.membershipIdPrefix + "ToggleOverlay") == -1) {
				if (d.body.className.trim()) {
					d.body.className += " " + window.membership_settings.membershipIdPrefix + "ToggleOverlay";
				} else {
					d.body.className = window.membership_settings.membershipIdPrefix + "ToggleOverlay";
				}
			}
		}

		function getData(req,forcecall) {
			req.method="GET";
			checkAuthcode(req,forcecall);
		}

		function getParameterByName(name) {
			var tempName = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
				regex = new RegExp("[\\?&]" + tempName + "=([^&#]*)"),
				results = regex.exec(location.search);
			
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}

		function getMembershipCookie() {
			var currCookie = cookie.get(s.cookie.userId);
			if (currCookie) {
				return w.JSON.parse(currCookie);
			}
		}

		function getRandomString() {
			return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
		}

		function getUserData(funcSuccess,funcFailure) {

			function failureUserData(msg,data) {
				if (funcFailure) {
					funcFailure(data);
				}
			}

			function successUserData(msg,data) {
				if (funcSuccess) {
					data.authcode = my.authcode.get();
					funcSuccess(data);
				}
			}

			if (!globals.processing.userData) {
				pubsub.subscribe("membership.failure.user.get",failureUserData);
				pubsub.subscribe("membership.failure.sso.check",failureUserData);
				pubsub.subscribe("membership.unauthorized.sso.check",failureUserData);

				pubsub.subscribe("membership.success.user.get",successUserData);

				getData({
					authorization:my.authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.success.user.get",
						failure:"membership.failure.user.get"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user"
				});
				globals.processing.userData = true;
			}
		}

		function hideProcessing(msg) {
			if (globals.processing.submitButton) {
				globals.processing.submitButton.disabled = false;
			}
			d.body.className = d.body.className.replace(window.membership_settings.membershipIdPrefix + "ToggleOverlay","");
		}

		function isExternalDomain() {
			var hostname = w.location.hostname.split("."),
			hostnameLen = hostname.length,
			tld = hostname[hostnameLen-1],
			sld = hostname[hostnameLen-2];

			if (sld != "nba" || tld != "com") {
				return true;
			} else {
				return false;
			}
		}

		function isLoggedIn() {
			var currCookie = cookie.get(s.cookie.userId);
			if (currCookie) {
				pubsub.publish("membership.success.cookie.standard.check");
				return true;
			} else {
				pubsub.publish("membership.failure.cookie.standard.check");
				return false;
			}
		}

		function logError(msg,data) {
			logger.log(msg+": "+w.JSON.stringify(data));
		}

		function loginAgain(msg,data) {
			pubsub.publish("membership.redirect.internal.user.relogin");
		}

		function logoutStorefront() {
			var form = d.createElement("form"),
			iframe = d.createElement("iframe");

			form.style.display = "none";
			form.setAttribute("method","GET");
			form.setAttribute("action",window.membership_settings.svrStorefront+"/user/logout");
			form.setAttribute("target",window.membership_settings.membershipIdPrefix + "RedirectFrame");

			iframe.style.display = "none";
			iframe.setAttribute("id",window.membership_settings.membershipIdPrefix + "RedirectFrame");
			iframe.setAttribute("name",window.membership_settings.membershipIdPrefix + "RedirectFrame");
			iframe.setAttribute("src","javascript:false");

			d.body.appendChild(iframe);
			d.body.appendChild(form);
			form.submit();
			d.body.removeChild(form);

		}

		function logPubSub(msg,data) {
			logger.log(msg);
		}

		function newsletterCheckOptOutCountry(country) {
			var countries = s.newsletter.optOutCountries;

			if(jQuery.inArray(country,countries) > -1) {
				return true;
			} else {
				return false;
			}
		}

		function postForm(req,forcecall) {
			req.method="POST";
			checkAuthcode(req,forcecall);
		}

		function processTemplate(params) {
			var currTemplate = w[namespace][subNamespace].templates[params.template.name];
			params.parentNode.innerHTML=currTemplate(params.template.data);
		}

		function putData(req,forcecall) {
			req.method="PUT";
			checkAuthcode(req,forcecall);
		}

		function requestData(req) {
			var xhr = new w.XMLHttpRequest(),
			qs,
			postData;

			if (req.method.toUpperCase() == "GET") {
				if (req.querystring && typeof req.querystring === "string") {
					qs = "?"+req.querystring;
				} else if (req.querystring && typeof req.querystring === "object") {
					qs = "?"+(querystring.stringify(req.querystring))
				}
				xhr.open(req.method,req.url+(qs || ""),true);
			} else {
				xhr.open(req.method,req.url,true);
			}

			if (req.contentType) {
				xhr.setRequestHeader("Content-type",req.contentType);
			}

			if (req.authorization) {
				xhr.setRequestHeader("Authorization",req.authorization);
			}

			if (req.credentials) {
				xhr.withCredentials = true;
			}

			xhr.setRequestHeader("X-Client-Application", (typeof(_client) !== 'undefined' ? _client.settings.device.os : '') + '|' + navigator.userAgent);

			xhr.onreadystatechange = function xhrResult() {
				if(parseInt(xhr.readyState, 10) === 4) {
					var contentType = this.getResponseHeader('content-type'),
					response = "";

					if (contentType && contentType.indexOf("application/json") > -1) {
						response = w.JSON.parse(xhr.responseText);
					} else {
						response = xhr.responseText;
					}

					switch(xhr.status) {
						case 200:
						case 220:
						case 222:
							logger.log(req.method.toUpperCase()+" Success");
							if (req.functions && req.functions.success) {
								req.functions.success(response);
							}
							if (req.messages && req.messages.success) {
								pubsub.publish(req.messages.success,response);
							}
						break;
						case 401:
							logger.log(req.method.toUpperCase()+" Unauthorized");
							if (req.functions && req.functions.unauthorized) {
								req.functions.unauthorized(response);
							}
							if (req.messages && req.messages.unauthorized) {
								pubsub.publish(req.messages.unauthorized,response);
							}
						break;
						default:
							logger.log(req.method.toUpperCase()+" Failure");
							if (req.functions && req.functions.failure) {
								req.functions.failure(response);
							}
							if (req.messages && req.messages.failure) {
								pubsub.publish(req.messages.failure,response);
							}
					}
				}
			};

			if (req.method.toUpperCase() == "GET") {
				xhr.send();
			} else {
				if (req.data && typeof req.data === "string") {
					postData = req.data;
				} else if (req.data && typeof req.data === "object") {
					postData = w.JSON.stringify(req.data);
				}
				xhr.send(postData);
			}
		}

		function queueRequest(req) {
			logger.log("Adding to XHR queue.");
			return function _queueRequest() {
				logger.log("Execute XHR queue.");
				if (req.hasOwnProperty("authorization")) {
					req.authorization=my.authcode.get();
				}
				requestData(req);
			}
		}

		function resetSsoCheckFlag() {
			/* Since we know the SSO check failed or was not currently authorized, reset the flag which would allow another attempt. */
			flags.ssoCheckProcessing = false;
		}

		/* Scan for callbacks that end-users, such as third-parties, may have loaded at the window-level. */
		function scanExternalCallbacks() {
			var callbacks = w[window.membership_settings.membershipEndUserCallbacks],
			success = function() {},
			failure = function() {};

			if (callbacks && callbacks.user) {
				logger.log("External callbacks detected.");
				if (callbacks.user.success) {
					logger.log("External user success callback detected.");
					success = callbacks.user.success;
				}
				if (callbacks.user.failure) {
					logger.log("External user failure callback detected.");
					failure = callbacks.user.failure;
				}
				getUserData(success,failure);
			}
		}

		function setAnchorLink(elem,url) {
			elem.href = url;
		}

		function storeSessionParams() {
			var qsVals = querystring.parse(w.location.search);
			for (var key in qsVals) {
				if (qsVals.hasOwnProperty(key) && qsVals[key] && key.indexOf(window.membership_settings.membershipIdPrefix + "") === 0) {
					storage.session.set(key,qsVals[key]);
				}
			}
		}

		function submitForm(type) {
			return function _submitForm(e) {
				e.preventDefault();
				pubsub.publish("membership.submit."+type,e);
				return false;
			}
		}

		function tabTextBox(event) {
			var $textBox = jQuery(event.target),
				maxlength = parseInt($textBox.attr('maxlength'), 10),
				value = $textBox.val();
			
			if (event.keyCode !== 39 && event.keyCode !== 37 && event.keyCode !== 13 && event.keyCode !== 8 && event.keyCode !== 16 && event.keyCode !== 9) {
				if (value.length === maxlength && $textBox.next('input:first').length) {
					$textBox.next('input:first').focus();
					$textBox.next('input:first').select();
				} else if ($textBox.next('input:first').length === 0 && value.length === maxlength && event.keyCode !== 9) {
					$textBox.parents('fieldset:first').next().find('input:first').focus();
				}
			}
		}
		
		function toggleStickyFooter() {
			
			if ((jQuery(window).height() - jQuery("#" + window.membership_settings.membershipIdPrefix + "Footer").height() > jQuery("#nbaMembershipHeader").height() + jQuery("#nbaMembership").height())) {
				jQuery("#" + window.membership_settings.membershipIdPrefix + "Footer").css({
					"position": "fixed",
					"bottom": "0",
					"width": "100%"
				});
			} else {
				jQuery("#" + window.membership_settings.membershipIdPrefix + "Footer").attr("style", "");
			}
		}
		
		function highlightCheckbox(event) {
			var $label = event ? jQuery(event.target).next('.nbaCheckbox') : false,
				$allLabels = jQuery('.nbaCheckbox');
			
			$allLabels.css({
				"outline": "none"
			});
			
			if ($label !== false) {
				$label.css({
					"outline": "1px dotted blue"
				});
			}
			
		}
		
		function highlightTextBox(event) {
			jQuery(this).select();
		}

		function togglePasswordDisplay(event) {
			var $passwordField,
				$checkbox;
				
			if (typeof(event.target) !== 'undefined') {
				$passwordField = jQuery("#" + jQuery(this).attr("data-password-field"));
				$checkbox = jQuery(event.target).parents('.nbaMembershipCheckbox:first').find('input[type=checkbox]');
				event.stopPropagation();
				
				if ($passwordField.length) {
					if ($checkbox.is(':checked')) {
						$passwordField.attr("type", "password");
					} else {
						$passwordField.attr("type", "text");
					}
				}
			} else {
				jQuery(".nbaMembershipCheckbox").each(function(index, element) {
					$passwordField = jQuery("#" + jQuery(element).attr("data-password-field"));
					$checkbox = jQuery(element).find('input[type=checkbox]');
					
					if ($passwordField.length) {
						if ($checkbox.is(':checked')) {
							$passwordField.attr("type", "text");
						} else {
							$passwordField.attr("type", "password");
						}
					}
				});
			}
			
		}

		/* Reveal some methods to the public API. */
		my.bindAnchor = bindAnchor;
		my.bindButton = bindButton;
		my.cancelForm = cancelForm;
		my.capitalizeFirst = capitalizeFirst;
		my.cleanupStorage = cleanupStorage;
		my.clearAdditionalData = clearAdditionalData;
		my.deleteData = deleteData;
		my.getData = getData;
		my.getMembershipCookie = getMembershipCookie;
		my.getRandomString = getRandomString;
		my.getUserData = getUserData;
		my.isExternalDomain = isExternalDomain;
		my.isLoggedIn = isLoggedIn;
		my.logError = logError;
		my.logoutStorefront = logoutStorefront;
		my.newsletter.checkOptOutCountry = newsletterCheckOptOutCountry;
		my.postData = postForm;
		my.postForm = postForm;
		my.processTemplate = processTemplate;
		my.putData = putData;
		my.relogin = loginAgain;
		my.scanExternalCallbacks = scanExternalCallbacks;
		my.setAnchorLink = setAnchorLink;
		my.submitForm = submitForm;
		my.togglePasswordDisplay = togglePasswordDisplay;
		my.getParameterByName = getParameterByName;
		
		/* This is where you return all of your public methods. */
		return my;

	/* The following are the modules you are passing in that your new namespace
	 * will use, this is where  you would pass in jQuery, etc. In this case
	 * we are passing in the settings file for this namespace as well as the
	 * global logger. */
	}(w[namespace][settings][subNamespace],
	  w[namespace].cookie,
	  w[namespace].querystring,
	  w[namespace].storage,
	  w[namespace].PubSub,
	  w[namespace].logger,
	  w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));
