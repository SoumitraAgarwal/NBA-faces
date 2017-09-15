/**
 * This is the NBA Membership SSO namespace.
 * @namespace _nba.membership.sso
 * @memberof! <global>
 */

;(function _MembershipSsoInitWrapper(namespace,subNamespace,sso,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	w[namespace][subNamespace][sso] = w[namespace][subNamespace][sso] ||
	(function _MembershipSsoInit(s,membership,authcode,errorHandler,cookie,pubsub,gl,w,d,undefined) {
		var my = {},
		initialized = false,
		type = "membership.sso",
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
			pubsub.subscribe("membership.failure.sso.check",errorHandler.failureApiCall);
			pubsub.subscribe("membership.failure.sso.set",errorHandler.failureApiCall);
			pubsub.subscribe("membership.failure.sso.unset",errorHandler.failureApiCall);

			pubsub.subscribe("membership.check.sso",checkSso);
			pubsub.subscribe("membership.set.sso",setSso);
			pubsub.subscribe("membership.unset.sso",unsetSso);

			pubsub.subscribe("membership.success.sso.check",successCheck);
		}

		/* Everything related to Secure Sign On */
		function checkSso() {
			membership.postData({
				contentType:"application/json",
				credentials:true,
				messages:{
					success:"membership.success.sso.check",
					failure:"membership.failure.sso.check",
					unauthorized:"membership.unauthorized.sso.check"
				},
				ssoCheck:true,
				url:s.servers.ids+"/sso/api/"+s.apiVersion.ids+"/check",
				data:{apps:s.sso.apps}
			},true);
		}

		function setSso(msg,data) {
			membership.postData({
				authorization:authcode.get(),
				contentType:"application/json",
				credentials:true,
				messages:{
					success:"membership.success.sso.set",
					failure:"membership.failure.sso.set"
				},
				url:s.servers.ids+"/sso/api/"+s.apiVersion.ids+"/set"
			});
		}

		function unsetSso(msg,data) {
			membership.postData({
				contentType:"application/json",
				credentials:true,
				messages:{
					success:"membership.success.sso.unset",
					failure:"membership.failure.sso.unset"
				},
				url:s.servers.ids+"/sso/api/"+s.apiVersion.ids+"/unset"
			},true);
		}

		function successCheck(msg,code) {
			/* Update the auth code. */
			authcode.set(code);

			pubsub.publish("membership.authorized.sso.check");
			pubsub.publish("membership.success.sso.authcode.update");
		}

		/* This is where you return all of your public methods. */
		my.check = checkSso;
		my.set = setSso;
		my.unset = unsetSso;

		return my;

	}(w[namespace][settings][subNamespace],
	  w[namespace][subNamespace],
	  w[namespace][subNamespace].authcode,
	  w[namespace][subNamespace].errorHandler,
	  w[namespace].cookie,
	  w[namespace].PubSub,
	  w[namespace].logger,
	  w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","sso",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));