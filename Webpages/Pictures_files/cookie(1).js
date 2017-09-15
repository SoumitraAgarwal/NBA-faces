/**
 * This is the NBA Membership cookie namespace.
 * This will handle all membership cookie functionality.
 * @namespace _nba.membership.cookie
 * @memberof! <global>
 */

;(function _MembershipCookieInitWrapper(namespace,subNamespace,cookie,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	w[namespace][subNamespace][cookie] = w[namespace][subNamespace][cookie] ||
	(function _MembershipCookieInit(s,membership,authcode,authsignature,errorHandler,cookie,pubsub,gl,w,d,undefined) {
		var my = {},
		cookieData = {},
		globals = {},
		initialized = false,
		type = "membership.cookie",
		logger = gl.getInstance(type.toLowerCase());

		/* Initialize the module. */
		(function init() {
			if (!initialized) {
				logger.log("Initializing.");

				initPubSub();

				initialized = true;
			} else {
				logger.log("Already initialized.");
			}
		}());

		function initPubSub() {

			pubsub.subscribe("membership.authorized.sso.check",checkForCookies);

			pubsub.subscribe("membership.failure.cookie.entitlements.get",errorHandler.failureApiCall);
			pubsub.subscribe("membership.failure.cookie.msib.get",errorHandler.failureApiCall);
			pubsub.subscribe("membership.failure.cookie.standard.user.get",errorHandler.failureApiCall);

			pubsub.subscribe("membership.set.cookie.entitlements",setEntitlements);
			pubsub.subscribe("membership.set.cookie.msib",setMsibCookie);
			pubsub.subscribe("membership.set.cookie.standard.user",setStandardCookieUser);
			pubsub.subscribe("membership.set.cookie.storefront.purchase",setStorefrontPurchaseCookie);
			pubsub.subscribe("membership.set.cookie.upgradeurl",setUpgradeUrl);

			pubsub.subscribe("membership.success.cookie.entitlements.get",successEntitlements);
			pubsub.subscribe("membership.success.cookie.msib.get",successMsibCookie);
			pubsub.subscribe("membership.success.cookie.standard.user.get",successStandardCookieUser);
			pubsub.subscribe("membership.success.cookie.upgradeurl.get",successUpgradeUrl);

			pubsub.subscribe("membership.update.cookie.standard",updateMembershipInfo);
		}

		/* If an authorized SSO call happened, check to see if the local domain has any login cookies set. */
		/* Logically this shouldn't be  */
		function checkForCookies() {
			if (!cookie.get(s.cookie.userId)) {
				pubsub.publish("membership.set.cookie.standard.user",{mode:"login"});
			}
		}

		function setEntitlements() {
			membership.getData({
				authorization:authcode.get(),
				contentType:"application/json",
				messages:{
					success:"membership.success.cookie.entitlements.get",
					failure:"membership.failure.cookie.entitlements.get"
				},
				url:s.servers.ids+"/regwall/api/"+s.apiVersion.ids+"/regwall/entitlements"
			});
		}

		function setMsibCookie() {
			membership.getData({
				authorization:authcode.get(),
				contentType:"application/json",
				messages:{
					success:"membership.success.cookie.msib.get",
					failure:"membership.failure.cookie.msib.get"
				},
				url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/msib/msib_tokens"
			});
		}

		function setStandardCookieUser(msg,data) {

			/* Set if this is a login or registration mode. */
			globals.mode = data.mode;

			membership.getData({
				authorization:authcode.get(),
				contentType:"application/json",
				messages:{
					success:"membership.success.cookie.standard.user.get",
					failure:"membership.failure.cookie.standard.user.get"
				},
				url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user"
			});
		}

		function setStorefrontPurchaseCookie(msg,data) {
			var cookieData = {};

			if (data) {
				if (data.storefrontAffiliateId) {
					cookieData.affiliate = data.storefrontAffiliateId;
				}
				if (data.storefrontGameId) {
					cookieData.game = data.storefrontGameId;
				}
				if (data.storefrontGameDate) {
					cookieData.gameDate = data.storefrontGameDate;
				}
				if (data.storefrontGameHome) {
					cookieData.gameHome = data.storefrontGameHome;
				}
				if (data.storefrontGameVisitor) {
					cookieData.gameVisitor = data.storefrontGameVisitor;
				}
				if (data.storefrontOfferId) {
					cookieData.offer = data.storefrontOfferId.toString();
				}
				if (data.storefrontProductId) {
					cookieData.product = data.storefrontProductId;
				}
				if (data.storefrontProductPrice) {
					cookieData.price = data.storefrontProductPrice;
				}
				if (data.storefrontTeamId) {
					cookieData.team = data.storefrontTeamId;
				}
				cookie.set({
					key:s.cookie.purchase,
					value:w.JSON.stringify(cookieData),
					path:s.cookie.path,
					domain:s.cookie.domain
				});
			}
		}

		function setStorefrontPurchaseCookieDirect(data) {
			setStorefrontPurchaseCookie("membership.set.cookie.storefront.purchase",data);
		}

		function setUpgradeUrl(msg,data) {
			membership.getData({
				authorization:authcode.get(),
				contentType:"application/json",
				messages:{
					success:"membership.success.cookie.upgradeurl.get",
					failure:"membership.failure.cookie.upgradeurl.get"
				},
				url:s.servers.ids+"/billing/api/"+s.apiVersion.ids+"/upgrade_url"
			});
		}

		function successEntitlements(msg,data) {
			var currData = {};

			if (data.entitlements) {
				currData.entitlements = data.entitlements;
			}

			/* Check if choice and, if so, get the team. */
			if (data.entitlementQualifiers && data.entitlementQualifiers.lpbc) {
				currData.teams = data.entitlementQualifiers.lpbc;
			}

			/* Check if there are single game qualifiers. If so, get the games purchased. */
			if (data.entitlementQualifiers && data.entitlementQualifiers.lpsg) {
				currData.games = data.entitlementQualifiers.lpsg;
			}

			if (data.authorizationSignatureToken) {
				authsignature.set(data.authorizationSignatureToken);
			}

			/* Calling directly to make sure this happens immediately. */
			updateMembershipInfo("membership.update.cookie.standard",currData);

			pubsub.publish("membership.success.cookie.entitlements.set");
		}

		function successMsibCookie(msg,data) {
			cookie.set({
				key:s.cookie.authId,
				value:data.authid,
				path:s.cookie.path,
				domain:s.cookie.domain,
				ttl:s.cookie.hoursToLive
			});

			pubsub.publish("membership.success.cookie.msib.set");
		}

		function successStandardCookieUser(msg,data) {
			var currTidCookie = cookie.get(s.cookie.turnerId),
			currUserCookie = cookie.get(s.cookie.userId);

			/* Don't reset this cookie if it already exists. */
			if (!currTidCookie && data && data.tid) {

				/* Set the old TSid cookie for compatibility reasons. */
				cookie.set({
					key:s.cookie.turnerId,
					value:"G"+data.tid,
					path:s.cookie.path,
					domain:s.cookie.domain,
					ttl:s.cookie.hoursToLive
				});
			}

			/* Don't reset this cookie if it already exists. */
			if (!currUserCookie) {

				/* Do some data preparation. */
				if (data && data.tid) {
					cookieData.tid = data.tid;
				}

				/* Start adding stuff to the new membership cookie. */
				if (data.userEmailResponses && data.userEmailResponses.length > 0) {
					var currEmailLength = data.userEmailResponses.length;
					for (var i=0;i<currEmailLength;i++) {
						if (data.userEmailResponses[i].primary === true) {
							cookieData.email = data.userEmailResponses[i].emailAddress;
						}
					}
				}
	
				/* Set the first name if it is available. */
				if (data.userProfileResponses && data.userProfileResponses.nba && data.userProfileResponses.nba.attributes && data.userProfileResponses.nba.attributes.firstName) {
					cookieData.firstName = data.userProfileResponses.nba.attributes.firstName;
				}

				/* Set the NBA Membership cookie. */
				cookie.set({
					key:s.cookie.userId,
					value:w.JSON.stringify(cookieData),
					path:s.cookie.path,
					domain:s.cookie.domain,
					ttl:s.cookie.hoursToLive
				});
			}

			/* Thought about moving these into login, but there are other pages
			 * that do this call the same way login does, so safer to keep them
			 * here so that they always happen. */
			if (globals.mode && globals.mode == "login") {
				pubsub.publish("membership.set.cookie.entitlements");
				pubsub.publish("membership.set.cookie.upgradeurl");
			}

			pubsub.publish("membership.success.cookie.standard.set");

		}

		function successUpgradeUrl(msg,data) {
			var currData = {};

			if (data && data.url) {
				currData.upgradeUrl = data.url;
			}

			/* Calling directly to make sure this happens immediately. */
			updateMembershipInfo("membership.update.cookie.standard",currData);

			pubsub.publish("membership.success.cookie.upgradeurl.set");
		}

		/* This function is used to update or add params to the membership information cookie. */
		function updateMembershipInfo(msg,params) {
			var currCookie = cookie.get(s.cookie.userId);
			if (params && typeof params === "object" && currCookie) {
				var cookieData = w.JSON.parse(currCookie);
				/* Add or update params. */
				for (var key in params) {
					cookieData[key] = params[key];
				}
				/* Reset the NBA Membership cookie. */
				cookie.set({
					key:s.cookie.userId,
					value:w.JSON.stringify(cookieData),
					path:s.cookie.path,
					domain:s.cookie.domain,
					ttl:s.cookie.hoursToLive
				});
			} else {
				logger.log("Cannot update membership cookie because it doesn't yet exist.");
			}

			pubsub.publish("membership.success.cookie.standard.update");
		}

		/* Everything related to the cookie */
		my.updateMembershipInfo = updateMembershipInfo;
		my.setStandard = setStandardCookieUser;
		my.setStorefrontPurchase = setStorefrontPurchaseCookieDirect;

		/* This is where you return all of your public methods. */
		return my;

	}(w[namespace][settings][subNamespace],
	  w[namespace][subNamespace],
	  w[namespace][subNamespace].authcode,
		w[namespace][subNamespace].authsignature,
	  w[namespace][subNamespace].errorHandler,
	  w[namespace].cookie,
	  w[namespace].PubSub,
	  w[namespace].logger,
	  w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","cookie",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));
