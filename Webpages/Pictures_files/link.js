/**
 * This is the NBA Membership Landing Page logic.
 */

;(function _MembershipImportLandingInitWrapper(namespace,subNamespace,settings,ns,w,d) {
  "use strict";
  (function _MembershipImportLandingInit(s,membership,analytics,cookie,querystring,storage,gl,pubsub,authcode,w,d,undefined) {
    var initialized = false,
    globals = {
      loggedIn:membership.isLoggedIn(),
      newWindow: false
    },
    type = "membership.landing", /* Type should be the new namespace name. */
    logger = gl.getInstance(type.toLowerCase()), /* Set a logger instance for this namespace. */
    validNationalBroadcasterCodesForDeepLinking = [ 'espn', 'abc', 'tnt', 'tntot' ],
    dataHost = getParameterByName('SDATA_URL_BASE') === "" ? "http://data.nba.com" : getParameterByName( 'SDATA_URL_BASE' ), // allow data override but not in prod
    cachedPromises = {};

    /* The following are some private methods. They can only be accessed
     * through a public method (below). */

    (function init() {
      var queryData = {};
      
      if (!initialized) {
        logger.log("Initializing.");

        initPubSub();
        initEntitlements();
        initBind();

        /* TODO: For the time being, these are setting visual placeholders, but eventually we will probably enable right-click again. */
        initPlaceholderLinks();

        initialized = true;
      } else {
        logger.log("Already initialized.");
      }
    }());

    function initBind() {

      /* Bind all of the membership links so that actions happen on click and keypress. */
      jQuery(d).on("click", "a[data-membership-action]",checkLinkType);
      jQuery(d).on("keypress", "a[data-membership-action]",checkLinkType);

      /* For the time being, treating a right-click on these links as a left-click to make logic simpler. */
      jQuery(d).on("contextmenu", "a[data-membership-action]",hijackRightClick);

    }

    function initLinkLoad() {
      var queryData = {};
      
      if (isAuto()) {
        queryData.gameDate = getParameterByName("nbaLinkDate");
        queryData.gameTricodes = getParameterByName("nbaLinkTricodes");
        queryData.gameId = getParameterByName("nbaLinkId");
        globals.redirectAfterOpen = getParameterByName("redirect");
        
        queryData.membershipAnalytics = getParameterByName("nbaLinkAnalytics");
        
        if (queryData.gameDate && queryData.gameTricodes) {
          if (getParameterByName("nbaLinkAction") === "listen") {
            redirectWatchListenLinkCallback(queryData, true);
          } else {
            redirectWatchListenLinkCallback(queryData);
          }
        } else { // no game id
          if (getParameterByName("nbaLinkAction") === "listen") {
            redirectWatchListenLinkCallback(queryData, true);
          } else {
            redirectWatchListenLinkCallback(queryData);
          }
        }
      }
    }

    function initEntitlements() {

      if (globals.loggedIn || (!globals.loggedIn && membership.isExternalDomain())) {
        /* Force the cookie domain to be the local domain. */
        /* Things inside this conditional should only happen on non-nba.com domains. */
        if (membership.isExternalDomain()) {
          s.cookie.domain = w.location.hostname;
          if (globals.loggedIn) {
            /* Subscribe to SSO unauthorized message in case we have been logged out.  If so, we need to clean up our local cookies. */
            pubsub.subscribe("membership.unauthorized.sso.check",unauthorizedSsoCheck);
            pubsub.publish("membership.set.cookie.entitlements");
          } else {
            pubsub.subscribe("membership.success.cookie.standard.set",initPlaceholderLinks);
            pubsub.publish("membership.check.sso");
          }
        } else {
          pubsub.publish("membership.set.cookie.entitlements");
        }
      }
    }

    function initPlaceholderLinks(msg) {

      /* The following will set some generic paths based on the type of action being requested. */
      /* TODO: This probably need refinement.  For instance, should we attempt to set query parameters at the time? */
      var links = jQuery("a[data-membership-action]"),
        i,
        len,
        linkData;

      /* If this was called via a message, then we know we should try to reset the logged-in statues. */
      if (msg) {
        /* Since we are resetting the links, reset the global loggedIn value. */
        globals.loggedIn = membership.isLoggedIn();
      }

      for (i = 0,len = links.length;i<len;i += 1) {
        linkData = jQuery(links[i]).data();
        switch(linkData.membershipAction) {
          case "dynamic-login":
            setDynamicLink(links[i],s.redirect.internal.user.logout,s.redirect.internal.user.login);
          break;
          case "mso":
            setCustomLink(links[i],s.redirect.internal.purchase.mso);
          break;
          case "purchase":
            setPurchaseLink(links[i]);
          break;
          case "trial":
            setTrialLink(links[i]);
          break;
          case "watch":
          case "listen": // @TODO should I let this fall through, or separate into two different breaks?
            if (linkData.membershipAction === "listen") {
              setWatchListenLink(links[i], linkData, true);
            } else {
              setWatchListenLink(links[i], linkData);
            }
            break;
          case "activate":
            setCustomLink(links[i],s.redirect.internal.user.providercredentials);
          break;
          default:
            setStandardLink(links[i],linkData.membershipAction);
        };
      }
    }

    function initPubSub() {
      pubsub.subscribe("membership.failure.cookie.standard.check", initLinkLoad);
      pubsub.subscribe("membership.success.cookie.entitlements.set", initLinkLoad);
      pubsub.subscribe("membership.unauthorized.sso.check", initLinkLoad);
    }

    /**
     * Initialze this as a class with "new"
     */
    function AndroidRedirect() {
      // force the return of a properly initialzed object
      if (!(this instanceof (AndroidRedirect))) {
        return new AndroidRedirect();
      }
      // define all variables
      var method = {},
        custom = "gametime://com.nbadigital.gametime/navigation/scores", // default to the scores page
        alt = "https://play.google.com/store/apps/details?id=com.nbadigital.gametimelite", // default to the scores page
        g_intent = "intent://com.nbadigital.gametime/navigation/scores#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end",
        timer,
        heartbeat,
        iframe_timer;
      
      function doAndriodDeepLink() {
        heartbeat = setInterval(intervalHeartbeat, 200);
        if (navigator.userAgent.match(/Chrome/)) {
          if( custom.indexOf( 'intent://' ) == 0 ) {
            useIntent();
          } else {
            tryWebkitApproach();
          }
        } else if (navigator.userAgent.match(/Firefox/)) {
          tryWebkitApproach();
          iframe_timer = setTimeout(function () {
            tryIframeApproach();
          }, 1500);
        } else {
          tryIframeApproach();
        }
      }
      
      function intervalHeartbeat() {
        if (document.webkitHidden || document.hidden) {
          method.clearTimers();
        }
      }

      function tryIframeApproach() {
        var iframe = document.createElement("iframe");
        iframe.style.border = "none";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.onload = function () {
          document.location = alt;
        };
        iframe.src = custom;
        document.body.appendChild(iframe);
      }

      function tryWebkitApproach() {
        document.location = custom;
        timer = setTimeout(function () {
          document.location = alt;
        }, 2500);
      }

      function useIntent() {
        document.location = g_intent;
      }
      
      // separating private and public functions, and starting over alphabetically 
      
      method.clearTimers = function() {
        clearTimeout(timer);
        clearTimeout(heartbeat);
        clearTimeout(iframe_timer);
      };
      
      method.launch = function(linkData) {
        var now = new Date().valueOf(),
          $gamesPromise = linkData.gameDate ? getCachedPromise(dataHost + "/data/5s/json/cms/noseason/scoreboard/" + linkData.gameDate + "/games.json") : false;
        
        if ($gamesPromise !== false) {
          
          $gamesPromise.fail(function() {
            doAndriodDeepLink();
          });
          
          $gamesPromise.done(function(data) {
            var game = filterByLinkData(data, linkData);
            
            if (game === false) { // no game found?
              custom = "gametime://com.nbadigital.gametime/navigation/scores";
              g_intent = "intent://com.nbadigital.gametime/navigation/scores#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end";
            } else if( game.dl && game.dl.link && Array.isArray( game.dl.link ) && ( parseInt( game.period_time.game_status, 10 ) === 2 ) && linkData.membershipAction !== "listen" ) { // live games with deep links
              var deepLinks = game.dl.link;
              deepLinks.sort( dynamicSort( 'code' ) );
              for( var i = 0; i < deepLinks.length; ++i ) {
                if( deepLinks[ i ].home_visitor == 'natl' ) {
                  switch( deepLinks[ i ].code ) {
                    case 'tntot':
                      custom = "gametime://com.nbadigital.gametime/navigation/tntovertime";
                      g_intent = "intent://com.nbadigital.gametime/navigation/tntovertime#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end";
                      alt = "https://play.google.com/store/apps/details?id=com.nbadigital.gametimelite";
                      break;
                    case 'tnt':
                      custom = "watchtnt://deeplink";
                      g_intent = "watchtnt://deeplink";
                      alt = "https://play.google.com/store/apps/details?id=com.turner.tnt.android.networkapp";
                      break;
                    case 'espn':
                    case 'abc':
                      custom = deepLinks[ i ].url;
                      g_intent = deepLinks[ i ].url;
                      alt = "https://play.google.com/store/apps/details?id=com.espn.score_center";
                      break;
                    default:
                      break;
                  }
                }
              }
            } else if (parseInt(game.tnt_ot, 10) === 1 && parseInt(game.period_time.game_status, 10) < 3 && linkData.membershipAction !== "listen") { // tnt ot game that's not in final state, and not audio?
              custom = "gametime://com.nbadigital.gametime/navigation/tntovertime";
              g_intent = "intent://com.nbadigital.gametime/navigation/tntovertime#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end";
            } else if (!linkData.gameDate || (!linkData.gameId && !linkData.gameTricodes)) { // no game data set
              custom = "gametime://com.nbadigital.gametime/navigation/scores";
              g_intent = "intent://com.nbadigital.gametime/navigation/scores#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end";
            } else if (linkData.gameDate && linkData.gameId) {  // game data available, by game ID
              custom = "gametime://com.nbadigital.gametime/navigation/scores/" + linkData.gameDate + "_" + linkData.gameId;
              g_intent = "intent://com.nbadigital.gametime/navigation/scores/" + linkData.gameDate + "_" + linkData.gameId + "#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end";
            } else if (linkData.gameDate && linkData.gameTricodes) {  // game data available, by tricodes
              custom = "gametime://com.nbadigital.gametime/navigation/scores/" + linkData.gameDate + "_" + linkData.gameId;
              g_intent = "intent://com.nbadigital.gametime/navigation/scores/" + linkData.gameDate + "_" + linkData.gameTricodes.substring(0, 3) + "_" + linkData.gameTricodes.substring(3, linkData.gameTricodes.length) + "#Intent;scheme=gametime;package=com.nbadigital.gametimelite;end";
            }
            
            doAndriodDeepLink();
            
          });
        
        } else { // no game set
          doAndriodDeepLink();
        }
        
        if (isAuto() && !navigator.userAgent.match(/Chrome/)) {
          setTimeout(function() {
            window.location = window.membership_settings.svrPage;
          }, 1000);
        }
      };
      
      return method;

    }

    function checkHasAccount() {
      return cookie.get(s.cookie.userId) ? true : false;
    }

    function checkLinkType(event) {
      var linkData = event.currentTarget.dataset,
        elem = event.currentTarget,
        keyCode = event.which || event.keyCode;
      
      if (keyCode !== 9) { // ignore tab

        event.preventDefault();
  
        switch(linkData.membershipAction) {
          case "dynamic-login":
            if (globals.loggedIn) {
              pubsub.publish("membership.redirect.external.user.logout",linkData);
            } else {
              pubsub.publish("membership.redirect.external.user.login",linkData);
            }
          break;
          case "mso":
            pubsub.publish("membership.redirect.external.leaguepass.mso",linkData);
          break;
          case "purchase":
            if (checkHasAccount()) {
              pubsub.publish("membership.redirect.internal.leaguepass.purchase.login",linkData);
            } else {
              pubsub.publish("membership.redirect.internal.leaguepass.purchase.register",linkData);
            }
          break;
          case "trial":
            pubsub.publish("membership.redirect.external.leaguepass.trial",linkData);
          break;
          case "watch":
            redirectWatchListenLinkCallback(linkData);
          break;
          case "listen":
            redirectWatchListenLinkCallback(linkData, true);
          break;
          case "activate":
            pubsub.publish("membership.redirect.external.leaguepass.activate",linkData);
          break;
          default:
            pubsub.publish("membership.redirect.external.user."+linkData.membershipAction,linkData);
        }
      }
    }
    
    function checkHasAccount() {
      return cookie.get(s.cookie.userId) ? true : false;
    }
    
    function checkMobile() { //backup for javascriptGlobalSettings.json not loading
      var isTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch),
        isMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
      // this is not by any means perfect, but is meant as a backup
      if (isMobile && isTouch) {
        return true;
      }
      
      return false;
    }
    
    function doDesktopRedirect(url, gameId) {
      var ls = getLinkSource();
      
      if (ls !== "") {
        
        if (isAuto()) {
          
          if (gameId) {
            window.location = url + "?" + ls + "&gameId=" + gameId + "#singleGame";
          } else {
            window.location = url + "?" + ls;
          }
          
        } else if (gameId) {
          //window.open(url + "?" + ls + "&gameId=" + gameId + "#singleGame");
          window.open(url + "?" + ls);
        } else {
          window.open(url + "?" + ls);
        }
        
      } else {
        
        if (isAuto()) {
          
          if (gameId) {
            window.location = url + "?" + ls + "&gameId=" + gameId + "#singleGame";
          } else {
            window.location = url + "?" + ls;
          }
          
        } else if (gameId) {
          //window.open(url + "?gameId=" + gameId + "#singleGame");
          window.open(url);
        } else {
          window.open(url);
        }
        
      }
      
    }
    
    function filterByLinkData(data, linkData) {
      var game = false;
      
      if (data.sports_content && data.sports_content.games && data.sports_content.games.game && Array.isArray(data.sports_content.games.game)) {
        data.sports_content.games.game.forEach(function(value, index) { //@TODO evaluate use of forEach
          if (linkData.gameId && linkData.gameId.toString() === value.id.toString()) {
            game = value;
            return true; // stop looping once you find the game by ID
          }
          if (linkData.gameTricodes && (linkData.gameDate + "/" + linkData.gameTricodes) === value.game_url.toString()) {
            game = value;
            return true; // stop looping once you find the game by tricodes
          }
        });
      }
      
      return game;
    }
    
    function focusWindow() {
      if (globals.newWindow !== false && globals.newWindow && !globals.newWindow.closed) {
        try {
          globals.newWindow.focus();
        } catch (e) {
          alert("Please disable your popup blocker.");
        }
      } else if (typeof(globals.newWindow) === "undefined") {
        alert("Please disable your popup blocker.");
      }
    }
    /**
     * This was copied from the launch js
     * @TODO we need to evaluate this
     */
    function getBrowserInfo() {
      var ua = navigator.userAgent,tem,M = ua.match( /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i ) || [];
      
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec( ua ) || [];
        return { name: 'IE', version: ( tem[1] || '' )};
      }
 
      if (M[1]==='Chrome') {
        tem = ua.match( /\bOPR\/(\d+)/ );
 
        if ( tem != null ) {
          return { name:'Opera', version:tem[1] };
        }
      }
 
      M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
 
      if ( ( tem = ua.match( /version\/(\d+)/i ) ) != null ) {
        M.splice( 1, 1, tem[1] );
      }
      
      return { name: M[0], version: M[1] };
      
    }

    function getCachedPromise(url) {
      if (typeof(url) !== "undefined") {

        if (typeof(cachedPromises[encodeURI(url)]) === "undefined" || (url.indexOf(dataHost) == 0 )) { // if you have not requested this feed before or if this is data server feed, request it

          cachedPromises[encodeURI(url)] = jQuery.ajax({
            url: url,
            dataType: "json",
            jsonp: false,
            timeout: 2000
          });

        }

      }
      return cachedPromises[encodeURI(url)];
    }
    
    function getParameterByName(name) {
      var param = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
        regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
        results = regex.exec(location.search);
      
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    function isExternal() {
      if (document.referrer && document.referrer.indexOf("nba.com") === -1) {
        return true;
      }
      return false;
    }
    
    function getLinkSource() {
      var ls = "";
      
      if (globals.linkAnalytics !== false) {
        ls = "ls=";
        if (isAuto()) {
          ls += "eref:";
        } else {
          ls += "iref:";
        }
        
        ls += getSection();
        
        if (globals.linkAnalytics && globals.linkAnalytics !== "external") {
          ls += ":" + globals.linkAnalytics;
        }
        
        ls += ":" + globals.linkAction;
      }
      
      return ls;
      
    }
    
    function getSection() {
      var sld = ""; // this will not work for hangtime.blogs.nba.com or something.co.uk type of hostnames
      
      if (isAuto()) {
        
        if (document.referrer) {
          
          sld = document.referrer.split('/')[2];
          sld = sld.split('.');
          
          if (sld.length === 2) {
            sld = sld[0];
          } else if (sld.length === 3) {
            sld = sld[1];
          } else if (sld.length === 4) {
            sld = sld[0];
          } else {
            sld = sld[sld.length - 2];
          }
          
        } else {
          sld = "3rdparty";
        }
        
        return "nba:" + sld;
      }
      
      if (_nba.omniture && _nba.omniture.getChannel) {
        return _nba.omniture.getChannel();
      }
      
      return "nba:3rdparty";
      
    }
    
    function hijackRightClick(event) {
      event.preventDefault();
      checkLinkType(event);
    }
    
    function isAuto() {
      if (typeof(w.drupalSettings.nbaLinkMode) !== "undefined" && w.drupalSettings.nbaLinkMode === "auto") {
        return true;
      }
      return false;
    }
    /**
     * Initialize this class with "new"
     */
    function IOSRedirect() {
      if (!(this instanceof (IOSRedirect))) {
        return new IOSRedirect();
      }
      // define all variables
      var method = {};

      method.launch = function(linkData) {
        var now = new Date().valueOf(),
          appLink = "gametime://scores",
          $gamesPromise = linkData.gameDate ? getCachedPromise(dataHost + "/data/5s/json/cms/noseason/scoreboard/" + linkData.gameDate + "/games.json") : false;
        
        if ($gamesPromise !== false) {
          
          $gamesPromise.fail(function() {
            redirectAppOrStoreIOS(appLink);
          });
          
          $gamesPromise.done(function(data) {
            var game = filterByLinkData(data, linkData);
            
            if (game === false) { // no game found in games.json
              appLink = "gametime://scores";
            } else if( game.dl && game.dl.link && Array.isArray( game.dl.link ) && ( parseInt( game.period_time.game_status, 10 ) === 2 ) && linkData.membershipAction !== "listen" ) { // live games with deep links
              var deepLinks = game.dl.link;
              deepLinks.sort( dynamicSort( 'code' ) );
              for( var i = 0; i < deepLinks.length; ++i ) {
                if( deepLinks[ i ].home_visitor == 'natl' ) {
                  switch( deepLinks[ i ].code ) {
                    case 'tntot':
                      appLink = "gametime://tntovertime";
                      break;
                    case 'tnt':
                      appLink = "watchtnt://deeplink";
                      break;
                    case 'espn':
                    case 'abc':
                      appLink = deepLinks[ i ].url;
                      break;
                    default:
                      break;
                  }
                }
              }
            } else if (parseInt(game.tnt_ot, 10) === 1 && parseInt(game.period_time.game_status, 10) < 3 && linkData.membershipAction !== "listen") { // tnt ot game that's not in final state, and not audio?
              appLink = "gametime://tntovertime";
            } else if (!linkData.gameDate || (!linkData.gameId && !linkData.gameTricodes)) { // game data set?
              appLink = "gametime://scores";
            } else if (linkData.gameDate && linkData.gameId) { // deep link to game with game ID
              appLink = "gametime://scores/" + linkData.gameDate + "_" + linkData.gameId;
            } else if (linkData.gameDate && linkData.gameTricodes) {  // deep link to game with tricodes
              appLink = "gametime://scores/" + linkData.gameDate + "_" + linkData.gameTricodes.substring(0, 3) + "_" + linkData.gameTricodes.substring(3, linkData.gameTricodes.length);
            }
            
            redirectAppOrStoreIOS(appLink);
            
          });
          
        } else { // error getting game data
          redirectAppOrStoreIOS(appLink);
        }
      };

      return method;

    }
    
    function openCenter(url, title, w, h) {
      // Fixes dual-screen position
      var dualScreenLeft = window.screenLeft || screen.left,
        dualScreenTop = window.screenTop || screen.top,
        width = window.innerWidth || document.documentElement.clientWidth || screen.width,
        height = window.innerHeight || document.documentElement.clientHeight || screen.height,
        left = ((width / 2) - (w / 2)) + dualScreenLeft,
        top = ((height / 2) - (h / 2)) + dualScreenTop;
        
      globals.newWindow = window.open(url, title, 'menubar=no,toolbar=no,status=no,location=no,resizable=yes,scrollbars=yes,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
      
    }
    
    function publishRedirect(data) {
      pubsub.subscribe("membership.redirect.external.purchase",redirectPage(s.redirect.internal.user.purchase));
    }
    
    function redirectAppOrStoreIOS(appLink) {
      var now = new Date().valueOf();
      var appid = 'id335744614' // nba
      if( appLink.indexOf( 'http' ) == 0 ) {
        window.location = appLink;
      } else {
        if( appLink.indexOf( 'watchtnt' ) == 0 ) {
          appid = 'id460494135';
        } else if( appLink.indexOf( 'sportscenter' ) == 0 ) {
          appid = 'id317469184';
        }
        // this setTimeout redirects to the store or to the app
        setTimeout(function() {
          setTimeout(function() {
            
            if (new Date().valueOf() - now > 500) {
              return;
            }
            
            window.location = 'http://itunes.apple.com/app/' + appid;
            
          }, 25);
          
          window.location = appLink;
        });
      }
    }
    
    function redirectAfterOpen() {
      if (isAuto()) {
        window.location = window.membership_settings.svrPage;
      }
    }
    
    function redirectDesktop(linkData, audio) {
      var $gamesPromise,
        $gameAccessPromise,
        entitlements = cookie.get(s.cookie.userId);

      if (typeof(linkData) !== "undefined" && typeof(linkData.membershipAnalytics) !== "undefined") {
        globals.linkAnalytics = linkData.membershipAnalytics;
      } else if (isAuto()) {
        globals.linkAnalytics = "external";
      } else {
        globals.linkAnalytics = false;
      }
      
      if (audio === true) {
        globals.linkAction = "listen";
      } else {
        globals.linkAction = "watch";
      }
      
      if (entitlements !== "") { // has entitlements?
        entitlements = JSON.parse(cookie.get(s.cookie.userId)).entitlements;
      }
      
      if (globals.loggedIn) { // if they're logged in

        if (linkData.gameDate && (linkData.gameId || linkData.gameTricodes)) { // if required game data is set
          $gamesPromise = getCachedPromise(dataHost + "/data/5s/json/cms/noseason/scoreboard/" + linkData.gameDate + "/games.json");
          
          if ($gamesPromise !== false) {
            
            $gamesPromise.fail(function() {
              logger.log("Could not fetch games.json!");
  
              if (entitlements.length) {  // is entitled?
                doDesktopRedirect('/games/');
                return true;
              }
              // not entitled, go to sales page
              doDesktopRedirect("/leaguepass/");
              
            });

            $gamesPromise.done(function(data) {
              var game = filterByLinkData(data, linkData),
                authorizationToken = authcode.get(),
                requestData = {};

              if (game === false) { // no game found?
                doDesktopRedirect("/leaguepass/");
                return true;
              }

              if( game.dl && game.dl.link && Array.isArray( game.dl.link ) && ( parseInt( game.period_time.game_status, 10 ) === 2 ) && !audio ) { // live games with deep links
                var deepLinks = game.dl.link;
                deepLinks.sort( dynamicSort( '-code' ) );
                for( var i = 0; i < deepLinks.length; ++i ) {
                  if( ( deepLinks[ i ].home_visitor == 'natl' ) && ( jQuery.inArray( deepLinks[ i ].code, validNationalBroadcasterCodesForDeepLinking ) > -1 ) ) {
                    doDesktopRedirect( deepLinks[ i ].url);
                    return true;
                  }
                }
              }

              if (parseInt(game.tnt_ot, 10) === 1 && parseInt(game.period_time.game_status, 10) < 3 && !audio) { // tnt ot game that's not in final state, and not audio?
                doDesktopRedirect("/tntovertime/");
                return true;
              }

              window.location = '/games/' + game.game_url;
              
            });
          } else { // if logged in but failed to find game
            if (entitlements.length) {
              window.location = '/games/' + game.game_url;
            } else {
              doDesktopRedirect("/leaguepass/");
            }
          }
        } else { // if logged in but no game values have been set
          if (entitlements.length) {
            window.location = '/games';
          } else {
            doDesktopRedirect("/leaguepass/");
          }
        }
        
      } else { // not logged in
        
        if (linkData.gameDate && (linkData.gameId || linkData.gameTricodes)) { // if required game data is set
          
          $gamesPromise = getCachedPromise(dataHost + "/data/5s/json/cms/noseason/scoreboard/" + linkData.gameDate + "/games.json");
          
          $gamesPromise.done(function(data) {
            var game = filterByLinkData(data, linkData),
              authorizationToken = authcode.get(),
              requestData = {};
            
            if (game === false) { // no game found?
              doDesktopRedirect(window.membership_settings.svrPage+"/leaguepass/");
              return true;
            }
            
            if( game.dl && game.dl.link && Array.isArray( game.dl.link ) && ( parseInt( game.period_time.game_status, 10 ) === 2 ) && !audio ) { // live games with deep links
              var deepLinks = game.dl.link;
              deepLinks.sort( dynamicSort( '-code' ) );
              for( var i = 0; i < deepLinks.length; ++i ) {
                if( ( deepLinks[ i ].home_visitor == 'natl' ) && ( jQuery.inArray( deepLinks[ i ].code, validNationalBroadcasterCodesForDeepLinking ) > -1 ) ) {
                  doDesktopRedirect( deepLinks[ i ].url );
                  return true;
                }
              }
            }

            if (parseInt(game.tnt_ot, 10) === 1 && parseInt(game.period_time.game_status, 10) < 3 && !audio) { // tnt ot game that's not in final state, and not audio?
              doDesktopRedirect(window.membership_settings.svrPage+"/tntovertime/");
              return true;
            }
            
            doDesktopRedirect(window.membership_settings.svrPage+"/leaguepass/", game.id);
            
          });
          
          $gamesPromise.fail(function() {
            doDesktopRedirect(window.membership_settings.svrPage+"/leaguepass/");
          });
        } else {
          doDesktopRedirect(window.membership_settings.svrPage+"/leaguepass/");
        }
      }
      
    }
    
    /**
     * Initialize the andriod or ios redirect classes
     * @param {Object} linkData
     */
    function redirectMobile(linkData) {
      var isIOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),
        isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1,
        iosRedirect,
        androidRedirect;
        
      if (isIOS) {
        iosRedirect = new IOSRedirect();
        iosRedirect.launch(linkData);
      } else if (isAndroid) {
        androidRedirect = new AndroidRedirect();
        androidRedirect.launch(linkData);
      }
    }
    
    function redirectWatchListenLinkCallback(linkData, audio) {

      if (checkDesktop()) {

        if (checkMobile()) { // if this is true, we're in tablet
          redirectMobile(linkData);
          return false;
        }

        if (audio && audio === true) {
          redirectDesktop(linkData, audio);
        } else {
          redirectDesktop(linkData);
        }
      } else {
        redirectMobile(linkData);
      }

    }

    function checkDesktop() {
      var os = window['_client'].settings.device.os;
      if (os === 'Windows'
        || os.indexOf('Windows NT') !== -1
        || os === 'Linux'
        || os.indexOf('Mac OS X') !== -1
        || os === 'Macintosh'
        || os === 'Chrome OS') {
        return true;
      }
      return false;
    }
    
    function setCustomLink(link,url) {
      /* TODO: Put some branding logic in here. */
      link.href = url;
    }

    function setDynamicLink(link,loggedIn,loggedOut) {
      if (cookie.get(s.cookie.userId)) {
        link.href = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+loggedIn;
        if (!link.innerHTML.trim() || link.innerHTML == s.display.text.login) {
          link.innerHTML = s.display.text.logout;
        }
      } else {
        link.href = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+loggedOut;
        if (!link.innerHTML.trim() || link.innerHTML == s.display.text.logout) {
          link.innerHTML = s.display.text.login;
        }
      }
    }

    function setPurchaseLink(link) {
      link.href = w.location.href;
    }

    function setStandardLink(link,key) {
      if (s.redirect.internal.user[key]) {
        link.href = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+s.redirect.internal.user[key];
      } else {
        setCustomLink(link,window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+"/");
      }
    }

    function setTrialLink(link) {
      link.href = window.membership_settings.svrSecure+window.membership_settings.membershipBasePath+"/"+s.branding.trial.leaguepass+s.redirect.internal.user.enroll;
    }

    function setWatchListenLink(link, linkData, audio) {
      var $gamesPromise = linkData.gameDate ? getCachedPromise(dataHost + "/data/5s/json/cms/noseason/scoreboard/" + linkData.gameDate + "/games.json") : false,
        game,
        entitlements = cookie.get(window.membership_settings.membershipIdPrefix+"Info");
      
      if (entitlements !== "") {
        entitlements = JSON.parse(cookie.get(window.membership_settings.membershipIdPrefix+"Info")).entitlements;
      }
      
      link.href = window.membership_settings.svrPage+"/leaguepass/"; // default
      
      if (typeof(linkData.gameDate) === "undefined" || (typeof(linkData.gameId) === "undefined" && typeof(linkData.gameTricodes) === "undefined")) {
        if (globals.loggedIn) {
          if (entitlements.length) {
            link.href = window.membership_settings.leaguePassVideoServer;
          } else {
            link.href = window.membership_settings.svrPage+"/leaguepass/";
          }
        } else {
          link.href = window.membership_settings.svrPage+"/leaguepass/";
        }
        return true;
      }
      
      if ($gamesPromise !== false) {
        
        $gamesPromise.fail(function() {
          logger.log("Could not fetch games.json!");
          if (globals.loggedIn) {
            if (!entitlements.length) {
              link.href = window.membership_settings.svrPage+"/leaguepass/";
            } else {
              link.href = window.membership_settings.leaguePassVideoServer;
            }
          }
        });

        $gamesPromise.done(function(data) {
          game = filterByLinkData(data, linkData);
          
          if (game === false) { //couldn't find game
            link.href = window.membership_settings.svrPage+"/leaguepass/";
            return true;
          }

          if( game.dl && game.dl.link && Array.isArray( game.dl.link ) && ( parseInt( game.period_time.game_status, 10 ) === 2 ) ) { // live games with deep links
            var deepLinks = game.dl.link;
            deepLinks.sort( dynamicSort( '-code' ) );
            for( var i = 0; i < deepLinks.length; ++i ) {
              if( ( deepLinks[ i ].home_visitor == 'natl' ) && ( jQuery.inArray( deepLinks[ i ].code, validNationalBroadcasterCodesForDeepLinking ) > -1 ) ) {
                link.href = deepLinks[ i ].url;
                return true;
              }
            }
          }
          
          if (parseInt(game.tnt_ot, 10) === 1) { // tnt ot game?
            link.href = window.membership_settings.svrPage+"/tntovertime/";
            return true;
          }
          
          if (globals.loggedIn) { //logged in?
            if (!entitlements.length) { //entiteled?
              link.href = window.membership_settings.svrPage+"/leaguepass/";
            } else {
              link.href = window.membership_settings.leaguePassVideoServer;
            }
            return true;
          }
          
          if (!game.lp || !game.lp.lp_video || game.lp.lp_video.toString() !== "true") { // if the game not carried by league pass
            link.href = window.membership_settings.leaguePassVideoServer;
            return true;
          }
          
          if (typeof(game.lp) !== "undefined" && typeof(game.lp.lp_video) !== "undefined" && game.lp.lp_video.toString() === "true") { // if the game IS carried by league pass
            if (audio === true) { //is this the listen button?
              link.href = window.membership_settings.leaguePassVideoServer+"&audioGameID=" + game.id;
            } else {
              link.href = window.membership_settings.leaguePassVideoServer+"&gameID=" + game.id;
            }
            return true;
          }
          
        });
      } else { // could not load games.json
        if (globals.loggedIn) {
          if (!entitlements.length) {
            link.href = window.membership_settings.svrPage+"/leaguepass/";
          } else {
            link.href = window.membership_settings.leaguePassVideoServer;
          }
        }
      }
    }

    /* Currently only called if local domain cookies are set and you are on an external domain. */
    function unauthorizedSsoCheck() {
      pubsub.subscribe("membership.clear.storage.complete",initPlaceholderLinks);
      membership.clearAdditionalData();
      pubsub.publish("membership.clear.storage.start");
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

  }(w[namespace][settings][subNamespace],
    w[namespace][subNamespace],
    w[namespace].analytics,
    w[namespace].cookie,
    w[namespace].querystring,
    w[namespace].storage,
    w[namespace].logger,
    w[namespace].PubSub,
    w[namespace][subNamespace].authcode,
    w,
    d));
}(window.membership_settings.jsNamespace,"membership",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));
