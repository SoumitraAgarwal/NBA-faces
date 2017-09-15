/**
 * This is the NBA Membership Redirect namespace.
 * This will handle all membership redirect functionality.
 * @namespace _nba.membership.redirect
 * @memberof! <global>
 */

;(function _MembershipRedirectInitWrapper(namespace,subNamespace,redirect,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	w[namespace][subNamespace][redirect] = w[namespace][subNamespace][redirect] ||
	(function _MembershipRedirectInit(s,membership,pubsub,gl,storage,querystring,cookie,membershipCookie,w,d,undefined) {
		var my = {},
		data = {},
		globals = {redirectUrl:"",redirecting:false},
		initialized = false,
		qs = querystring.parse(w.location.search),
		type = "membership.redirect",
		logger = gl.getInstance(type.toLowerCase());
		var white_list_domains = [
			'nba.com',
			'nba.net',
			'wnba.com',
			'mavs.com',
			'turner.com',
			'vgtf.net',
			'dmtio.net',
			'nbagameworn.com'];

		/* Initialize the module. */
		(function init() {
			if (!initialized) {
				logger.log("Initializing.");

				initPubSub();
				initRedirect();

				initialized = true;
			} else {
				logger.log("Already initialized.");
			}
		}());

		function initRedirect() {
			if (!getBranding()) {
				/* TODO: Figure out a cleaner way to do this. */
				var currLocation = w.location.href;
				if (currLocation.indexOf(window.membership_settings.svrSecure+window.membership_settings.membershipBasePath) > -1 &&
					currLocation.indexOf(window.membership_settings.svrSecure + window.membership_settings.membershipBasePath+"/admin/") == -1 &&
					currLocation.indexOf(window.membership_settings.svrSecure + window.membership_settings.membershipBasePath+"/purchase/") == -1 &&
					currLocation.indexOf(window.membership_settings.svrSecure + window.membership_settings.membershipBasePath+"/sweepstakes/") == -1 &&
					currLocation.indexOf(window.membership_settings.svrSecure + window.membership_settings.membershipBasePath+"/test/") == -1 &&
					currLocation.indexOf(window.membership_settings.svrSecure + window.membership_settings.membershipBasePath+"/user/") == -1) {
					var path = w.location.pathname.split("/");
					if (path[2]) {
						setBranding(path[2]);
					}
				}
			}

			if(qs[window.membership_settings.membershipIdPrefix+"RedirectExternalUrl"]) {
				setExternalUrls("membership.redirect.stop");
			}

		}

		function initPubSub() {

			pubsub.subscribe("membership.redirect",executeRedirect);
			pubsub.subscribe("membership.redirect.cancel",returnCancelUrl);
			pubsub.subscribe("membership.redirect.logout",returnLogout);
			pubsub.subscribe("membership.redirect.previous",returnPreviousUrl);

			/* The "internal" and "external" values are where you are coming from, not where you are going to. */
			pubsub.subscribe("membership.redirect.external",setExternalUrls);
			pubsub.subscribe("membership.redirect.external",setCurrentMessage); /* TODO: Possibly combine this call with the one above as this may be causing redirect to be called too often (I think). */
			pubsub.subscribe("membership.redirect.external.leaguepass.mso",redirectPage(s.redirect.internal.user.purchase));

			pubsub.subscribe("membership.redirect.external.leaguepass.activate",redirectMsoActivate);
			
			pubsub.subscribe("membership.redirect.external.branded.login",redirectBrandedLogin);
			pubsub.subscribe("membership.redirect.external.branded.register",redirectBrandedRegister);
			
			pubsub.subscribe("membership.redirect.external.leaguepass.purchase.checkout",redirectPurchase);
			pubsub.subscribe("membership.redirect.external.leaguepass.purchase.login",redirectPurchaseLogin);
			pubsub.subscribe("membership.redirect.external.leaguepass.purchase.register",redirectPurchaseRegister);
			pubsub.subscribe("membership.redirect.external.leaguepass.trial",redirectTrial);
			pubsub.subscribe("membership.redirect.external.user.login",redirectPage(s.redirect.internal.user.login));
			pubsub.subscribe("membership.redirect.external.user.logout",redirectPage(s.redirect.internal.user.logout));
			pubsub.subscribe("membership.redirect.external.user.personalize",redirectPage(s.redirect.internal.user.personalize));
			pubsub.subscribe("membership.redirect.external.user.register",redirectPage(s.redirect.internal.user.register));
			pubsub.subscribe("membership.redirect.external.user.settings",redirectPage(s.redirect.internal.user.settings));
			pubsub.subscribe("membership.redirect.external.user.welcome",redirectPage(s.redirect.internal.user.welcome));

			pubsub.subscribe("membership.redirect.internal",setCurrentMessage);
			pubsub.subscribe("membership.redirect.internal.custom",redirectCustom);
			pubsub.subscribe("membership.redirect.internal.homepage",redirectPage(s.redirect.external.homepage));
			pubsub.subscribe("membership.redirect.internal.leaguepass.mso.login",redirectMsoLogin);
			pubsub.subscribe("membership.redirect.internal.leaguepass.purchase.checkout",redirectPurchase);
			pubsub.subscribe("membership.redirect.internal.leaguepass.purchase.login",redirectPurchaseLogin);
			pubsub.subscribe("membership.redirect.internal.leaguepass.purchase.register",redirectPurchaseRegister);
			pubsub.subscribe("membership.redirect.internal.leaguepass.trial",redirectTrial);

			pubsub.subscribe("membership.redirect.internal.user.email",redirectPage(s.redirect.internal.user.email));
			pubsub.subscribe("membership.redirect.internal.user.login",redirectPage(s.redirect.internal.user.login));
			pubsub.subscribe("membership.redirect.internal.user.logout",redirectPage(s.redirect.internal.user.logout));
			pubsub.subscribe("membership.redirect.internal.user.msocongrats",redirectPage(s.redirect.internal.user.msocongrats));
			pubsub.subscribe("membership.redirect.internal.user.newsletter",redirectPage(s.redirect.internal.user.newsletter));
			pubsub.subscribe("membership.redirect.internal.user.password.reset",redirectPage(s.redirect.internal.user.password.reset));
			pubsub.subscribe("membership.redirect.internal.user.password.forgot",redirectPage(s.redirect.internal.user.password.forgot));
			pubsub.subscribe("membership.redirect.internal.user.personalize",redirectPage(s.redirect.internal.user.personalize));
			pubsub.subscribe("membership.redirect.internal.user.providercredentials",redirectPage(s.redirect.internal.user.providercredentials));
			pubsub.subscribe("membership.redirect.internal.user.relogin",relogin);
			pubsub.subscribe("membership.redirect.internal.user.register",redirectPage(s.redirect.internal.user.register));
			pubsub.subscribe("membership.redirect.internal.user.settings",redirectPage(s.redirect.internal.user.settings));
			pubsub.subscribe("membership.redirect.internal.user.welcome",redirectPage(s.redirect.internal.user.welcome));

			pubsub.subscribe("membership.set.internal.redirect",setInternalRedirectMessage);

		}

		function executeRedirect(msg,data) {
			if (msg != "membership.redirect.stop" && globals.redirectUrl) {
				redirect(globals.redirectUrl,data);
			} else {
				logger.log("No redirect URL set. Message is: "+msg);
			}
		}

		function getRedirectCookie() {
			var currCookie = cookie.get(s.cookie.redirect);
			if (currCookie) {
				return w.JSON.parse(currCookie);
			} else {
				return {};
			}
		}

		function getBranding() {
			var cookieData = getRedirectCookie(),
			branding = cookieData.branding;

			/* If we are on an external site, force an external branding (if no current branding is set). */
			if (membership.isExternalDomain() && !branding) {
				branding = s.branding.external;
			}

			return branding || "";
		}

		function getExternalUrl() {
			var cookieData = getRedirectCookie();
			return cookieData.externalUrl;
		}

		function getExternalCancelUrl() {
			var cookieData = getRedirectCookie();
			return cookieData.externalCancelUrl;
		}

		function getCurrentMessage() {
			var cookieData = getRedirectCookie();
			return cookieData.currentMessage;
		}

		function getInternalRedirectMessage() {
			var cookieData = getRedirectCookie();
			return cookieData.internalRedirectMessage;
		}

		function redirect(url,data) {
			if (url && !globals.redirecting) {
				globals.redirecting=true;
				w.location.assign(setAnalytics(url,data));
			} else if (globals.redirecting) {
				logger.log("Redirect already in progress.");
			} else {
				logger.log("No redirect URL was set.");
			}
		}
		function redirectBrandedLogin(msg,data) {

				setBranding(data.branding);
	
				var branding = getBranding();
				globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+s.redirect.internal.user.login;
		}
		function redirectBrandedRegister(msg,data) {

				setBranding(data.branding);
	
				var branding = getBranding();
				globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+s.redirect.internal.user.register;
		}
		function redirectMsoActivate(msg,data) {

				setBranding("linear");

				var branding = getBranding();
				globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+s.redirect.internal.user.providercredentials;
		}

		function redirectMsoLogin(msg,data) {

			setBranding("linear");

			var branding = getBranding();
			globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+s.redirect.internal.user.login;
		}

		function redirectPage(url) {
			return function _redirectPage(msg,data) {
				if (data && data.membershipBranding) {
					setBranding(data.membershipBranding);
				}
				var branding = getBranding();
				/* If it is an absolute URL, then just add query string and redirect, otherwise build the URL with branding. */
				if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
					globals.redirectUrl = url+setQueryString(data);
				} else {
					globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+url+setQueryString(data);
				}
			}
		}

		function redirectPurchase(msg,data) {
			membershipCookie.setStorefrontPurchase(data);

			if (data) {
				if (data.storefrontAffiliateId && data.storefrontOfferId) {
					globals.redirectUrl = redirectPurchaseAffiliate(data);
				} else if (data.storefrontGameId && data.storefrontOfferId) {
					globals.redirectUrl = redirectPurchaseGame(data);
				} else if (data.storefrontOfferId) {
					globals.redirectUrl = redirectPurchaseCheckout(data);
				} else {
					logger.warn("No purchase offer ID set.");
				}
			} else {
				logger.warn("No purchase data set.");
			}
		}

		function redirectPurchaseAffiliate(data) {
			var redirectSettings = s.redirect.external.purchase,
			redirectUrl = "?redirect=";

			if (data.storefrontGameId && data.storefrontOfferId) {
				redirectUrl += encodeURIComponent(redirectPurchaseGame(data));
			} else if (data.storefrontOfferId) {
				redirectUrl += encodeURIComponent(redirectPurchaseCheckout(data));
			} else {
				logger.warn("No purchase offer ID set.");
			}

			return redirectSettings.affiliate+encodeURIComponent(data.storefrontAffiliateId)+(redirectUrl=="?redirect="?"":redirectUrl);
		}

		function redirectPurchaseCheckout(data) {
			var redirectSettings = s.redirect.external.purchase;
			return redirectSettings.checkout+encodeURIComponent(data.storefrontOfferId);
		}

		function redirectPurchaseGame(data) {
			var redirectSettings = s.redirect.external.purchase;

			return redirectSettings.game+encodeURIComponent(data.storefrontGameId)+"/checkout/"+encodeURIComponent(data.storefrontOfferId);
		}

		function redirectPurchaseLogin(msg,data) {
			redirectPurchase(msg,data);

			/* Reset any internal messages that may have been set by a previous flow. */
			removeInternalRedirectMessage();

			if (data && data.membershipBranding) {
				setBranding(data.membershipBranding);
			}
			var branding = getBranding();
			globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+s.redirect.internal.user.login+"?"+window.membership_settings.membershipIdPrefix+"RedirectExternalUrl="+encodeURIComponent(globals.redirectUrl);
		}

		function redirectPurchaseRegister(msg,data) {
			redirectPurchase(msg,data);

			/* Reset any internal messages that may have been set by a previous flow. */
			removeInternalRedirectMessage();

			if (data && data.membershipBranding) {
				setBranding(data.membershipBranding);
			}
			var branding = getBranding();
			globals.redirectUrl = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+(branding?"/"+branding:"")+s.redirect.internal.user.register+"?"+window.membership_settings.membershipIdPrefix+"RedirectExternalUrl="+encodeURIComponent(globals.redirectUrl);
		}

		function redirectTrial(msg,data) {

			/* Force branding. */
			setBranding(s.branding.trial.leaguepass);

			/* Removing the external cancel URL.*/
			removeExternalCancelUrl();

			/* Reset any internal messages that may have been set by a previous flow. */
			removeInternalRedirectMessage();

			redirectPage(s.redirect.internal.user.enroll)(msg,data);
		}

		function redirectCustom(msg,url) {
			globals.redirectUrl = url;
		}

		function relogin(msg,data) {
			storage.session.set(window.membership_settings.membershipIdPrefix+"Error","Session has timed-out due to inactivity, Please sign in.");
			redirectPage(s.redirect.internal.user.login)();
		}

		function returnCancelUrl(msg,data) {
			var externalCancelUrl = getExternalCancelUrl(),
			internalMessage = getInternalRedirectMessage();
			if (internalMessage &&
				msg != "membership.redirect.cancel.user.login" &&
				msg != "membership.redirect.cancel.user.register") {
				removeInternalRedirectMessage();
				pubsub.publish(internalMessage);
			} else if (externalCancelUrl) {
					globals.redirectUrl = externalCancelUrl;
					/* Since we are leaving for an external location, kill the cookie. */
					cookie.remove({
						key:s.cookie.redirect,
						path:s.cookie.path,
						domain:s.cookie.domain
					});
			} else {
					globals.redirectUrl = s.redirect.external.homepage;
					/* Since we are leaving for an external location, kill the cookie. */
					cookie.remove({
						key:s.cookie.redirect,
						path:s.cookie.path,
						domain:s.cookie.domain
					});
			}
		}

		function returnHomepage(msg,data) {
			globals.redirectUrl = s.redirect.external.homepage;
		}

		function returnLogout(msg,data) {

			var branding = getBranding(),
			externalCancelUrl = getExternalCancelUrl();

			/* Force a certain logout location if logging out from the storefront. */
			if (branding && branding == "leaguepass") {
				externalCancelUrl = s.redirect.external.leaguepass;
			}

			/* Override the external redirect URL if a query parameter has been sent (since that should override any logic). */
			if (qs[window.membership_settings.membershipIdPrefix+"RedirectExternalUrl"]) {
				if (isWhitelistedDomain(qs[window.membership_settings.membershipIdPrefix+"RedirectExternalUrl"])) {
					externalCancelUrl = qs[window.membership_settings.membershipIdPrefix + "RedirectExternalUrl"];
				}
			}

			/* Since we are leaving for an external location, kill the cookie. */
			cookie.remove({
				key:s.cookie.redirect,
				path:s.cookie.path,
				domain:s.cookie.domain
			});

			if (externalCancelUrl) {
				globals.redirectUrl = externalCancelUrl;
			} else {
				globals.redirectUrl = s.redirect.external.homepage;
			}
		}

		function returnPreviousUrl(msg,data) {
			var url = getExternalUrl(),
			internalMessage = getInternalRedirectMessage();

			if (internalMessage) {
				removeInternalRedirectMessage();
				pubsub.publish(internalMessage);
			} else if (url) {
				cookie.remove({
					key:s.cookie.redirect,
					path:s.cookie.path,
					domain:s.cookie.domain
				});
				globals.redirectUrl = url;
			} else {
				pubsub.publish("membership.redirect.internal.homepage");
			}
		}

		function removeExternalCancelUrl() {
			var cookieData = getRedirectCookie();
			delete cookieData.externalCancelUrl;
			setRedirectCookie(cookieData);
		}

		function removeExternalUrl() {
			var cookieData = getRedirectCookie();
			delete cookieData.externalUrl;
			setRedirectCookie(cookieData);
		}

		function removeInternalRedirectMessage() {
			var cookieData = getRedirectCookie();
			delete cookieData.internalRedirectMessage;
			setRedirectCookie(cookieData);
		}

		/* Set an Adobe/Omniture link source for this link. */
		function setAnalytics(url,data) {
			if (url && data && data.membershipLinkSource) {
				if (url.indexOf("?") != -1) {
					return url+"&ls="+data.membershipLinkSource;
				} else {
					return url+"?ls="+data.membershipLinkSource;
				}
			} else if (url) {
				return url;
			} else {
				return "";
			}
		}

		function setBranding(branding) {
			var cookieData = getRedirectCookie();
			cookieData.branding = branding;
			setRedirectCookie(cookieData);
		}

		function setCurrentMessage(msg) {
			var cookieData = getRedirectCookie();
			cookieData.currentMessage = msg;
			setRedirectCookie(cookieData);
		}

		function setInternalRedirectMessage(msg,internalMessage) {
			var cookieData = getRedirectCookie();
			cookieData.internalRedirectMessage = internalMessage;
			setRedirectCookie(cookieData);
		}

		function setExternalCancelUrl(url) {
			var cookieData = getRedirectCookie();
			cookieData.externalCancelUrl = url;
			setRedirectCookie(cookieData);
		}

		function setExternalUrls(msg,data) {
			var cookieData = getRedirectCookie();

			/* This first parameter was a misnomer, but might be in use already, so leaving it in place, just in case. */
			if (data && data.url) {
				cookieData.externalUrl = data.url;
			} else if (data && data.membershipRedirectExternalUrl) {
				cookieData.externalUrl = data.membershipRedirectExternalUrl;
			} else if (qs[window.membership_settings.membershipIdPrefix+"RedirectExternalUrl"]) {
				if (isWhitelistedDomain(qs[window.membership_settings.membershipIdPrefix+"RedirectExternalUrl"])) {
				    cookieData.externalUrl = qs[window.membership_settings.membershipIdPrefix + "RedirectExternalUrl"];
				} else {
				    cookieData.externalUrl = s.redirect.external.homepage;
				}
				cookieData.externalCancelUrl = cookieData.externalUrl;

			} else {
				cookieData.externalUrl = w.location.href;
			}
			/* Set the external cancel URL. */
			if (!cookieData.externalCancelUrl && w.location.href.indexOf(window.membership_settings.svrSecure+window.membership_settings.membershipBasePath) == -1) {
				cookieData.externalCancelUrl = w.location.href;
			}
			setRedirectCookie(cookieData);
		}

		function isWhitelistedDomain(url) {
			for (var key in white_list_domains) {
				if (white_list_domains.hasOwnProperty(key)) {
					if (white_list_domains[key].replace(/^\s+|\s+$/gm,'') !== '') {
						var pattern = new RegExp('^(?:http(?:s)?:\/\/)?(?:[^\.^\/^\?]+\.)?([^\.^\/^\?]+\.)?([^\.^\/^\?]+\.)?([.^\/^\?]+)' + white_list_domains[key].replace('.', '\.'));
						if (pattern.test(url)) {
							return true;
						}
					}
				}
			}
			return false;
		}

		function setQueryString(data) {
			var temp = {},
			query = false;

			if (jQuery.isEmptyObject(data)) {
				return "";
			} else {
				for (var key in data) {
					if (data.hasOwnProperty(key) && data[key]) {
						/* Exclude some values that are not supposed to be sent as parameters. */
						/* TODO: Figure out if there is a better way to do this. */
						if (key != "membershipAction" && 
							key != "membershipBranding" && 
							key != "storefrontOfferId" && 
							key != "storefrontAffiliateId" && 
							key != "storefrontProductId") {
							query = true;
							if(key.match(/^nba/)) {
								temp[key]=data[key];
							}
							else {
								temp["nba"+membership.capitalizeFirst(key)]=data[key];
							}
						}
					}
				}
				/* If not on an NBA.com domain, then add the current location as an external redirect query parameter. */
				if (membership.isExternalDomain()) {
					query = true;
					temp[window.membership_settings.membershipIdPrefix+"RedirectExternalUrl"] = w.location.href;
				}
				/* Build the query string, if there are values that need to be sent. */
				if (query) {
					return "?"+querystring.stringify(temp);
				} else {
					return "";
				}
			}
		}

		function setRedirectCookie(data) {
			cookie.set({
				key:s.cookie.redirect,
				value:w.JSON.stringify(data),
				path:s.cookie.path,
				domain:s.cookie.domain
			});
		}

		my.branding = {
			get:getBranding
		};

		my.internal = {
			get:getInternalRedirectMessage
		};

		my.location = {
			get:getCurrentMessage
		};

		my.external = {
			isWhitelistedDomain:isWhitelistedDomain
		};

		/* This is where you return all of your public methods. */
		return my;

	}(w[namespace][settings][subNamespace],
	  w[namespace][subNamespace],
	  w[namespace].PubSub,
	  w[namespace].logger,
	  w[namespace].storage,
	  w[namespace].querystring,
	  w[namespace].cookie,
	  w[namespace][subNamespace].cookie,
	  w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","redirect",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));
