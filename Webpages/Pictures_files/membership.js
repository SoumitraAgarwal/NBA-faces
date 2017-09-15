/**
 * This is the settings file for our _nba.membership namespace.
 * @namespace _nba.settings.membership
 * @memberof! <global>
 */
;(function(namespace,subNamespace,settings,ns,w,d) {

	if (ns) {
		ns.safeCreate([namespace,settings]);
	}

	var configuration = {
		apiVersion:{
			ids:window.membership_settings.membershipAccountApiVersion
		},
		branding:{
			dleague:"dleague",
			external:"external",
			trial:{
				leaguepass:"leaguepassfreetrial"
			},
			wnba:"wnba"
		},
		billing:{
			id:"LPBFullSingle"
		},
		cookie:{
			authId:"authid",
			domain:".nba.com",
			hoursToLive:8760,
			path:"/",
			purchase:window.membership_settings.storefrontIdPrefix+"PurchaseInfo",
			redirect:window.membership_settings.membershipIdPrefix+"RedirectInfo",
			turnerId:"TSid",
			userId:window.membership_settings.membershipIdPrefix+"Info"
		},
		dataParamPrefix:"data-membership-",
		debug:window.membership_settings.membershipJavascriptDebug,
		display:{
			text:{
				login:"Sign In",
				logout:"Sign Out"
			}
		},
		entitlement:{
			lpbp:"League Pass",
			lpbc:"League Pass Choice",
			lpsg:"League Pass Single Game",
			lpvipnb:"VIP League Pass",
			slb:"Summer League Pass"
		},
		error:{
			generalId:"#"+window.membership_settings.membershipIdPrefix+"ErrorsGeneral"
		},
		newsletter:{
			defaultList:[
				"NBADaily",
				"NBAOffersPlus",
				"NBASpecialDelivery",
				"MembershipEmail"
			],
			optOutCountries:[
				/* "US", US here for testing purposes. */
				"CA",
				"DE"
			]
		},
		product:{
			id:"6000.14600"
		},
		providers:[
			{
				"type": "tve",
				"id": "ATT",
				"displayName": "AT&T U-verse",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/ATT.png"
			},
			{
				"type": "tve",
				"id": "www_websso_mybrctv_com",
				"displayName": "Blue Ridge Communications",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/BLUERIDGE.svg"
			},
			{
				"type": "tve",
				"id": "Brighthouse",
				"displayName": "Brighthouse",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/BRIGHTHOUSE.png"
			},
			{
				"type": "flat",
				"id": "Comcast",
				"displayName": "Comcast Xfinity",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/COMCAST.png"
			},
			{
				"type": "tve",
				"id": "Cox",
				"displayName": "Cox",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/COX.png"
			},
			{
				"type": "tve",
				"id": "DTV",
				"displayName": "DIRECTV",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/DIRECTV.png"
			},
			{
				"type": "tve",
				"id": "Dish",
				"displayName": "Dish",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/DISH.png"
			},
			{
				"type": "tve",
				"id": "FRONTIER",
				"displayName": "Frontier Communications",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/FRONTIER.svg"
			},
			{
				"type": "tve",
				"id": "hotwirecommunications_auth-gateway_net",
				"displayName": "Hotwire Communications",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/HOTWIRE.svg"
			},
			{
				"type": "tve",
				"id": "lib040",
				"displayName": "Liberty Cablevision of PR",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/LIBERTY.png"
			},
			{
				"type": "tve",
				"id": "lit020",
				"displayName": "Litestream",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/LITESTREAM.svg"
			},
			{
				"type": "tve",
				"id": "Cablevision",
				"displayName": "Optimum",
				"logoUrl": "http://idp.optimum.net/idp.optimum.net/images/Optimum_color1_3.png"
			},
			{
				"type": "tve",
				"id": "RCN",
				"displayName": "RCN",
				"logoUrl": "https://www.rcn.com/images/global/logos/rcn_logo_11233.png"
			},
			{
				"type": "tve",
				"id": "mar050",
				"displayName": "Summit Broadband",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/SUMMIT.png"
			},
			{
				"type": "tve",
				"id": "TWC",
				"displayName": "Time Warner Cable",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/TWC.png"
			},
			{
				"type": "tve",
				"id": "ElasticSSO",
				"displayName": "Turner Employee/Guest",
				"logoUrl": "https://s.cdn.turner.com/xslo/cvp/config/common/tve/assets/turner_silver_112x33.png"
			},
			{
				"type": "tve",
				"id": "Verizon",
				"displayName": "Verizon FiOS",
				"logoUrl": "https://s.cdn.turner.com/nba/nba/.element/img/3.0/msoproviders/VERIZON.png"
			}
		],
		redirect:{
			external:{
				homepage:window.membership_settings.svrPage+"/",
				leaguepass:window.membership_settings.svrPage+"/leaguepass/",
				purchase:{
					affiliate:window.membership_settings.svrStorefront+"/affiliate/",
					checkout:window.membership_settings.svrStorefront+"/checkout/",
					game:window.membership_settings.svrStorefront+"/game/"
				}
			},
			internal:{
				user:{
					email:"/user/email/",
					enroll:"/user/enroll/",
					login:"/user/login/",
					logout:"/user/logout/",
					newsletter:"/user/newsletter/",
					password:{
						reset:"/user/passwordreset/",
						forgot:"/user/forgotpassword/",
						message: "/user/forgotpasswordmessage/"
					},
					personalize:"/user/personalize/",
					providercredentials:"/user/providercredentials/",
					msocongrats: "/user/congrats/",
					register:"/user/register/",
					settings:"/user/settings/",
					welcome:"/user/welcome/"
				}
			}
		},
		register:{
			mode:"normal",
			status:"M",
			apps:["responsys","billing","preferences"],
			tos:{
				docName:"TOS",
				version:"1"
			}
		},
		servers:{
			ids:window.membership_settings.membershipAccountApiServer,
			purchase:"https://purchase.lab.nba.com/purchase/method/creditcard/index.html",
			hoa:"https://secure.prodtest.sj.vindicia.com/vws"
		},
		sso:{
			apps:["nba","responsys","billing","preferences"]
		},
		templateSrc:window.membership_settings.membershipBasePath+"/templates.html",
		validation:{
			config:{
				namespace: "data-validation-",
				inputs: "input, textarea, select",
				excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden]",
				priorityEnabled: true,
				multiple: null,
				group: null,
				uiEnabled: true,
				validationThreshold: 3,
				focus: "first",
				trigger: false,
				errorClass: window.membership_settings.membershipIdPrefix+"ValidationError",
				successClass: window.membership_settings.membershipIdPrefix+"ValidationSuccess",
				classHandler: function (ParsleyField) {},
				errorsContainer: function (ParsleyField) {},
				errorsWrapper: "<ul class=\"" + window.membership_settings.membershipIdPrefix + "ErrorsList\"></ul>",
				errorTemplate: "<li></li>"
			},
			errors:{
				overrides : {
					errorCode: {
						"email.exists":"You indicated you are a new customer, but an account has already been created with the email address that was provided for this registration.  Please try to sign in or request a password reset from the \"Sign In\" page.",
						"freePreview.enroll.duplicate":"It appears that your user has already been enrolled in the free trial for this period.  If you are experiencing issues using your free trial, please contact customer service using the help link on this page.",
						"freePreview.inactive.enroll":"The current Free Trial period has ended. To purchase an NBA LEAGUE PASS subscription visit: <a href=\""+window.membership_settings.svrPage+"/leaguepass/\">NBA.com/leaguepass</a>.",
						"freePreview.not.available":"The current Free Trial period has ended. To purchase an NBA LEAGUE PASS subscription visit: <a href=\""+window.membership_settings.svrPage+"/leaguepass/\">NBA.com/leaguepass</a>.",
						"identity.already.in.use":"You indicated you are a new customer, but a Facebook account has already been linked with the email address that was provided for this registration.  Please try to sign in with your Facebook account from the \"Sign In\" page."
					},
					errorField : {
						"email.exists": window.membership_settings.membershipIdPrefix+"EmailAddressWrapper",
						"user.credentials.invalid": "nbaMembershipEmailAddressWrapper,nbaMembershipPasswordWrapper"
					},
					errorMessage : {
						"Unable to delete email." : "Email address cannot match the current email address.",
						"Customer account not found." : "We were unable to match the account number you entered to an NBA LEAGUE PASS subscription. Please check your entry and try again.",
						"Specified partner account not available." : "This account is already in use."
					}
				}
			},
			messages:{
				defaultMessage: "This value seems to be invalid.",
				type: {
					email:	"Please enter a valid email address.",
					url:	"This value should be a valid url.",
					number:	"This value should be a valid number.",
					integer:	"This value should be a valid integer.",
					digits:	"This value should be digits.",
					alphanum:	"This value should be alphanumeric.",
					name: "The name cannot have special characters."
				},
				notblank:	"This value should not be blank.",
				required:	"All highlighed values are required.",
				pattern:	"This value seems to be invalid.",
				min:	"This value should be greater than or equal to %s.",
				max:	"This value should be lower than or equal to %s.",
				range:	"This value should be between %s and %s.",
				minlength:	"This value is too short. It should have %s characters or more.",
				maxlength:	"This value is too long. It should have %s characters or fewer.",
				length:	"This value length is invalid. It should be between %s and %s characters long.",
				mincheck:	"You must select at least %s choices.",
				maxcheck:	"You must select %s choices or fewer.",
				check:	"You must select between %s and %s choices.",
				equalto:	"This value should be the same."
			}
		}
	};

	/* Extend the config if jQuery is available. */
	if (jQuery) {
		w[namespace][settings][subNamespace] = jQuery.extend(true,(w[namespace][settings][subNamespace] || {}),configuration);
		/* Configure the Parsley validator. */
		/* Would be nice to get these configs namespaced under _nba */
		w.ParsleyConfig = jQuery.extend(true,(w.ParsleyConfig || {}),w[namespace][settings][subNamespace]["validation"]["config"]);
		w.ParsleyConfig.i18n = w.ParsleyConfig.i18n || {};
		w.ParsleyConfig.i18n.en = jQuery.extend(true,(w.ParsleyConfig.i18n.en || {}),w[namespace][settings][subNamespace]["validation"]["messages"]);
	} else {
		w[namespace][settings][subNamespace] = w[namespace][settings][subNamespace] || configuration;
	}

}(window.membership_settings.jsNamespace,"membership",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));
