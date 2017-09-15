/**
 * This is the NBA Membership Error Handler namespace.
 * This will handle all base membership functionality.
 * @namespace _nba.membership.errorHandler
 * @memberof! <global>
 */

;(function _MembershipErrorHandlerInitWrapper(namespace,subNamespace,errorHandler,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	w[namespace][subNamespace][errorHandler] = w[namespace][subNamespace][errorHandler] ||
	(function _MembershipErrorHandlerInit(s,membership,pubsub,gl,w,d,undefined) {
		var my = {},
		data = {},
		initialized = false,
		type = "membership.errorHandler", /* Type should be the new namespace name. */
		logger = gl.getInstance(type.toLowerCase()); /* Set a logger instance for this namespace. */

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
			pubsub.subscribe("membership.display.error.general",displayCustomErrorGeneral);
		}

		/* Everyting related to error handling. */
		function displayApiError(params) {
			var json = params.json;
			if (w.ParsleyUI) {
				/* Remove the error message if it was already displayed once. */
				w.ParsleyUI.removeError(jQuery(params.target).parsley(),getApiErrorId({counter:params.counter,json:json}),false);
				/* Display the current error under the desired target. */
				w.ParsleyUI.addError(jQuery(params.target).parsley(),getApiErrorId({counter:params.counter,json:json}),getApiErrorMessage({counter:params.counter,json:json}));
			}
		}

		function displayApiErrorField(params){
			var error = params.json.errors[params.counter].error;
			if(s.validation.errors.overrides.errorField.hasOwnProperty(error)){
				var fields = s.validation.errors.overrides.errorField[error];
				var field = fields.split(",");
				for(var i=0;i<field.length;i++){
					if(w.ParsleyUI && jQuery("#"+field[i]).length > 0){
						w.ParsleyUI.addError(jQuery("#"+field[i]).parsley(), "myCustomError", " ");
					}
				}
			}
		}

		function displayCustomError(params) {
			if (w.ParsleyUI) {
				/* Remove the error message if it was already displayed once. */
				w.ParsleyUI.removeError(jQuery(params.target).parsley(),params.errorId,false);
				/* Display the current error under the desired target. */
				w.ParsleyUI.addError(jQuery(params.target).parsley(),params.errorId,params.errorMessage);
			}
		}

		function displayCustomErrorGeneral(msg,message) {
			displayCustomError({
				target:s.error.generalId,
				errorId:"custom-error-returned",
				errorMessage:message
			});
		}

		function failureApiCall(msg,response) {
			loopApiErrors({
				target:s.error.generalId,
				json:response,
			});
		}

		function getApiErrorMessage(params) {
			if (typeof params.counter !== "undefined" && params.json && typeof params.json === "object" && params.json.errors[params.counter]) {
				if(s.validation.errors.overrides.errorCode.hasOwnProperty(params.json.errors[params.counter].error)){
					return s.validation.errors.overrides.errorCode[params.json.errors[params.counter].error];
				} else if(s.validation.errors.overrides.errorMessage.hasOwnProperty(params.json.errors[params.counter].message)){
					return s.validation.errors.overrides.errorMessage[params.json.errors[params.counter].message];
				} else {
					return params.json.errors[params.counter].message;
				}
			} else {
				return "No error message found.";
			}
		}

		function getApiErrorId(params) {
			if (typeof params.counter !== "undefined" && params.json && typeof params.json === "object" && params.json.errors[params.counter]) {
				return params.json.errors[params.counter].error.replace(/\./g,"-");
			} else {
				return "no-error-id-found";
			}
		}

		function loopApiErrors(params) {
			if (params.json && typeof params.json === "object" && params.json.errors && params.json.errors.length > 0) {
				var errorCount = params.json.errors.length;
				for (var i=0;i<errorCount;i++) {
					displayApiError({
						target:params.target,
						counter:i,
						json:params.json,
					});
					displayApiErrorField({
						counter:i,
						json:params.json,
					});
				}
			} else {
				displayCustomError({target:s.error.generalId,errorId:"no-errors-returned",errorMessage:"No error ID or message returned from backend API."});
			}
		}

		my.displayApiError = displayApiError;
		my.displayCustomError = displayCustomError;
		my.failureApiCall = failureApiCall;
		my.getApiErrorMessage = getApiErrorMessage;
		my.getApiErrorId = getApiErrorId;
		my.loopApiErrors = loopApiErrors;

		/* This is where you return all of your public methods. */
		return my;

	}(w[namespace][settings][subNamespace],
	  w[namespace][subNamespace],
	  w[namespace].PubSub,
	  w[namespace].logger,
	  w,
	  d));

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","errorHandler",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));