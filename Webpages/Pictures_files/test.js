/**
 * This is the NBA Membership test namespace.
 * This is a testing namespace that we can use for special test cases.
 * @namespace _nba.membership.test
 * @memberof! <global>
 */

;(function _MembershipTestInitWrapper(namespace,subNamespace,test,settings,ns,w,d) {
	"use strict";
	if (ns) {
		ns.safeCreate([namespace,subNamespace]);
	}

	/* This is a cheesy attempt to not easily expose this functionality to the production code.
	 * Would be better to just not include it at all in production. */
	if (test) {
		w[namespace][subNamespace][test] = w[namespace][subNamespace][test] ||
		(function _MembershipTestInit(s,membership,authcode,cookie,pubsub,gl,w,d,undefined) {
			var my = {},
			currEmail = "",
			currentVid = "",
			currentProduct = "",
			currentTeam = "",
			currentPurchaseMode = "",
			initialized = false,
			type = "membership.test",
			logger = gl.getInstance(type.toLowerCase());
	
			/* Initialize the module. */
			function init() {
				if (!initialized) {
					logger.log("Initializing.");
	
					initPubSub();
	
					initialized = true;
				} else {
					logger.log("Already initialized.");
				}
			}
	
			function initPubSub() {
				pubsub.subscribe("membership.test.create.billing.app",postBillingEntitlement);
				pubsub.subscribe("membership.test.create.facebook.email.random",createFacebookRandomEmail);
				pubsub.subscribe("membership.test.create.facebook.identity.random",createFacebookRandomIdentity);

				pubsub.subscribe("membership.test.unsubscribe.facebook.email.subscriptions",getFacebookEmailSubscriptions);

				pubsub.subscribe("membership.test.failure.facebook.identity.random.create",membership.logError);
				pubsub.subscribe("membership.test.failure.facebook.identity.delete",membership.logError);
				pubsub.subscribe("membership.test.failure.facebook.identity.get",membership.logError);

				pubsub.subscribe("membership.test.get.facebook.subscriptions",getFacebookEmail);

				pubsub.subscribe("membership.test.success.billing.app.create",postCashboxAccount);
				pubsub.subscribe("membership.test.success.billing.profile",successBillingProfile);
				pubsub.subscribe("membership.test.success.billing.sync",postBillingProfile);
				pubsub.subscribe("membership.test.success.cashbox.account",postCashboxAutobill);
				pubsub.subscribe("membership.test.success.cashbox.account",postTeam);
				pubsub.subscribe("membership.test.success.cashbox.autobill",postHoaPurchase);
				pubsub.subscribe("membership.test.success.cashbox.finalize",postBillingSync);

				pubsub.subscribe("membership.test.success.facebook.email.random.create",getFacebookEmailList);
				pubsub.subscribe("membership.test.success.facebook.email.get",getFacebookEmailSubscriptions);
				pubsub.subscribe("membership.test.success.facebook.email.list.get",deleteFacebookEmail);
				pubsub.subscribe("membership.test.success.facebook.email.delete",createFacebookRandomIdentity);
				pubsub.subscribe("membership.test.success.facebook.email.subscriptions.get",deleteFacebookEmailSubscriptions);
				pubsub.subscribe("membership.test.success.facebook.email.subscriptions.delete",createFacebookRandomEmail);

				pubsub.subscribe("membership.test.success.facebook.identity.delete",successFacebookDelete);
				pubsub.subscribe("membership.test.success.facebook.identity.random.create",getFacebookMembershipIdentity);
				pubsub.subscribe("membership.test.success.facebook.identity.get",deleteFacebookMembershipIdentity);
			}

			function createFacebookRandomEmail(msg,data) {
				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.email.random.create",
						failure:"membership.test.failure.facebook.email.random.create"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user/email",
					data:{emailAddress:"facebook.nba.test+"+membership.getRandomString()+"@gmail.com",primary:true}
				});
			}

			function createFacebookRandomIdentity() {
				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.identity.random.create",
						failure:"membership.test.failure.facebook.identity.random.create"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/identity/identities",
					data:{identityType:"_INTERNAL",principal:"facebook.remove."+membership.getRandomString(),credential:membership.getRandomString()}
				});
			}

			/* This is for removing the email address that was associated with the Facebook account. */
			function deleteFacebookEmail(msg,data) {
				for (var i=0,len=data.length;i<len;i++) {
					if (data[i].primary === false) {
						currEmail = data[i].emailAddress;
					}
				}

				membership.deleteData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.email.delete",
						failure:"membership.test.failure.facebook.email.delete"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user/email/"+encodeURIComponent(currEmail)
				});
			}

			function deleteFacebookEmailSubscriptions(msg,prevdata) {

				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.email.subscriptions.delete",
						failure:"membership.test.failure.facebook.email.subscriptions.delete"
					},
					url:s.servers.ids+"/responsys/api/"+s.apiVersion.ids+"/subscriptions/delete",
					data:prevdata
				});
			}

			/* This is for removing the Facebook Identity. */
			function deleteFacebookMembershipIdentity(msg,data) {
				if (data[0] && data[0].id) {
					membership.deleteData({
						authorization:authcode.get(),
						contentType:"application/json",
						messages:{
							success:"membership.test.success.facebook.identity.delete",
							failure:"membership.test.failure.facebook.identity.delete"
						},
						url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/identity/FACEBOOK/"+data[0].id
					});
				}
			}

			/* This is for getting the email address that we assume was linked with the Facebook account. */
			function getFacebookEmail(msg,data) {
				membership.getData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.email.get",
						failure:"membership.test.failure.facebook.email.get"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user/emails"
				});
			}

			function getFacebookEmailList(msg,data) {
				membership.getData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.email.list.get",
						failure:"membership.test.failure.facebook.email.list.get"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user/emails"
				});
			}

			function getFacebookEmailSubscriptions(msg,data) {
				for (var i=0,len=data.length;i<len;i++) {
					if (data[i].primary === true) {
						currEmail = data[i].emailAddress;
					}
				}

				membership.getData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.email.subscriptions.get",
						failure:"membership.test.failure.facebook.email.subscriptions.get"
					},
					url:s.servers.ids+"/responsys/api/"+s.apiVersion.ids+"/subscriptions",
					querystring:{email:currEmail}
				});
			}

			/* This is for getting the Facebook identity for which we want to delete. */
			function getFacebookMembershipIdentity(msg,data) {
				membership.getData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.facebook.identity.get",
						failure:"membership.test.failure.facebook.identity.get"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/identity/identities",
					querystring:{identityType:"FACEBOOK"}
				});
			}

			function postBillingEntitlement(msg,data) {

				if (data && data.type && data.type == "full") {
					currentPurchaseMode = data.type;
					currentProduct = "6000.14600";
				} else if (data && data.type && data.type == "choice") {
					currentPurchaseMode = data.type;
					currentProduct = "6000.14501";
				} else {
					currentProduct = "6000.14600";
				}

				if (data && data.team) {
					currentTeam = data.team;
				}

				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.billing.app.create",
						failure:"membership.test.failure.billing.app.create"
					},
					url:s.servers.ids+"/core/api/"+s.apiVersion.ids+"/user/refresh_authtoken",
					data:{apps:["billing","nba.updatepassword","nba.authn","responsys.subscribe","responsys"]}
				});
			}

			function postBillingProfile(msg,data) {
				membership.getData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.billing.profile",
						failure:"membership.test.failure.billing.profile"
					},
					url:s.servers.ids+"/billing/api/"+s.apiVersion.ids+"/profile"
				});
			}

			function postBillingSync(msg,data) {
				var currCookie = w.JSON.parse(cookie.get(s.cookie.userId));

				membership.postData({
					contentType:"application/json",
					messages:{
						success:"membership.test.success.billing.sync",
						failure:"membership.test.failure.billing.sync"
					},
					url:s.servers.ids+"/billing/api/"+s.apiVersion.ids+"/billing_sync",
					data:{tid:currCookie.tid,misc:{}}
				});
			}

			function postCashboxAccount(msg,data) {

				authcode.set(data);

				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.cashbox.account",
						failure:"membership.test.failure.cashbox.account"
					},
					url:s.servers.ids+"/billing/api/"+s.apiVersion.ids+"/storefront/account",
					data:{apps:["billing"]}
				});
			}

			function postCashboxAutobill(msg,data) {
				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.cashbox.autobill",
						failure:"membership.test.failure.cashbox.autobill"
					},
					url:s.servers.ids+"/billing/api/"+s.apiVersion.ids+"/storefront/websession/autobill_update",
					data:{
						returnUrl:"https://s.cdn.turner.com/nba/tmpl_asset/static/nba-cms3-homepage/1596/elements/global/favicon16.ico",
						errorUrl:"https://s.cdn.turner.com/nba/tmpl_asset/static/nba-cms3-homepage/1596/elements/global/favicon16.ico",
						merchantBillingPlanId:"LPBFullSingle",
						merchantProductId:currentProduct
					}
				});
			}

			function postTeam(msg,data) {
				if (currentTeam) {
					membership.postData({
						authorization:authcode.get(),
						contentType:"application/json",
						messages:{
							success:"membership.test.success.choiceteams",
							failure:"membership.test.failure.choiceteams"
						},
						url:s.servers.ids+"/choiceteams/api/"+s.apiVersion.ids+"/choiceteams",
						data:{
							teams:[currentTeam]
						}
					});
				}
			}

			function postFinalize() {
				/* Remove temp form which is no longer needed. */
				var iframe = d.getElementById("nbaMembershipRedirectFrame");
				d.body.removeChild(iframe);

				membership.postData({
					authorization:authcode.get(),
					contentType:"application/json",
					messages:{
						success:"membership.test.success.cashbox.finalize",
						failure:"membership.test.failure.cashbox.finalize"
					},
					url:s.servers.ids+"/billing/api/"+s.apiVersion.ids+"/storefront/websession/finalize",
					data:{
						vid:currentVid
					}
				});
			}

			function postHoaPurchase(msg,data) {
				currentVid = data.vid;
				var form = d.createElement("form"),
				iframe = d.createElement("iframe"),
				vin_WebSession_VID = d.createElement("input"),
				vin_PaymentMethod_Type = d.createElement("input"),
				vin_PaymentMethod_accountHolderName = d.createElement("input"),
				vin_PaymentMethod_creditCard_account = d.createElement("input"),
				vin_PaymentMethod_creditCard_expirationDate = d.createElement("input"),
				vin_AutoBill_currency = d.createElement("input");

				vin_WebSession_VID.setAttribute("name","vin_WebSession_VID");
				vin_WebSession_VID.setAttribute("value",currentVid);

				vin_PaymentMethod_Type.setAttribute("name","vin_PaymentMethod_Type");
				vin_PaymentMethod_Type.setAttribute("value","CreditCard");

				vin_PaymentMethod_accountHolderName.setAttribute("name","vin_PaymentMethod_accountHolderName");
				vin_PaymentMethod_accountHolderName.setAttribute("value","Registration Test");

				vin_PaymentMethod_creditCard_account.setAttribute("name","vin_PaymentMethod_creditCard_account");
				vin_PaymentMethod_creditCard_account.setAttribute("value","4987654321098769");

				vin_PaymentMethod_creditCard_expirationDate.setAttribute("name","vin_PaymentMethod_creditCard_expirationDate");
				vin_PaymentMethod_creditCard_expirationDate.setAttribute("value","201705");

				vin_AutoBill_currency.setAttribute("name","vin_AutoBill_currency");
				vin_AutoBill_currency.setAttribute("value","USD");

				form.appendChild(vin_WebSession_VID);
				form.appendChild(vin_PaymentMethod_Type);
				form.appendChild(vin_PaymentMethod_accountHolderName);
				form.appendChild(vin_PaymentMethod_creditCard_account);
				form.appendChild(vin_PaymentMethod_creditCard_expirationDate);
				form.appendChild(vin_AutoBill_currency);

				form.style.display = "none";
				form.setAttribute("method","POST");
				form.setAttribute("action","https://secure.prodtest.sj.vindicia.com/vws");
				form.setAttribute("target","nbaMembershipRedirectFrame");

				iframe.style.display = "none";
				iframe.setAttribute("id","nbaMembershipRedirectFrame");
				iframe.setAttribute("name","nbaMembershipRedirectFrame");
				iframe.setAttribute("src","javascript:false");

				d.body.appendChild(iframe);
				iframe.onload = postFinalize;
				d.body.appendChild(form);
				form.submit();
				d.body.removeChild(form);
			}

			function purchase(data) {
				init();
				pubsub.publish("membership.test.create.billing.app",data);
			}

			function successBillingProfile(msg,data) {
				if (data && data.entitlements) {
					pubsub.publish("membership.update.cookie.standard",{entitlements:data.entitlements});
				}
			}

			function successFacebookDelete(msg,data) {
				alert("Facebook Account Successfully Unlinked");
				/* Pretending we are coming from an external page. */
				/* pubsub.publish("membership.redirect.external.logout"); */
			}

			/* This is the starting point for breaking a Facebook link. */
			function removeFacebookAccountLink() {
				init();
				var currCookie = cookie.get(s.cookie.userId);
				if (currCookie) {
					var cookieData = w.JSON.parse(currCookie);
				}
				if (authcode.get() && cookieData && cookieData.identityType == "FACEBOOK") {
					pubsub.publish("membership.test.get.facebook.subscriptions");
				} else {
					alert("You don't appear to be logged in with any authcode or you are logged in with a non-Facebook account.  Please log in with your Facebook account and try again.");
				}
			}

			my.purchase = purchase;
			my.removeFacebookAccountLink = removeFacebookAccountLink;

			/* This is where you return all of your public methods. */
			return my;
	
		}(w[namespace][settings][subNamespace],
		  w[namespace][subNamespace],
		  w[namespace][subNamespace].authcode,
		  w[namespace].cookie,
		  w[namespace].PubSub,
		  w[namespace].logger,
		  w,
		  d));
	}

	/* END: The main logic for the namespace. */

/* Below we are using global CMS3 variables to set the main NBA namespace and
 * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership",window.membership_settings.membershipJavascriptTestObject,window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));