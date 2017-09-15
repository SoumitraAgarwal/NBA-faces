(function ($, ns, module, settings) {

  module[ns] = {};

  var s = module[window.membership_settings.jsSettings].membership,
    game = [],
    ssoChecked = false,
    entitlementsSet = false,
    entitlements = [],
    checkingSso = false;

  module[ns].init = function init() {
    module.PubSub.subscribe("membership.authorized.sso.check", module[ns].moduleCallback);
    module.PubSub.subscribe("membership.failure.sso.check", module[ns].moduleCallback);
    module.PubSub.subscribe("membership.unauthorized.sso.check", module[ns].moduleCallback);
    module.PubSub.subscribe("dalton.success.storage.follow", module[ns].updateFollowStorage);
    module.PubSub.subscribe("membership.success.cookie.entitlements.set", module[ns].moduleCallback);
    module.PubSub.subscribe("membership.failure.cookie.entitlements.get", module[ns].moduleCallback);
    module.PubSub.subscribe("dalton.internal.success.games.entitlement", module[ns].setFPGameEntitlement);
    module.PubSub.subscribe("membership.check.sso", function (msg, data) {
      this.ssoChecked = true;
    });
  };

  module[ns].checkLogin = function checkLogin() {
    var currCookie = module.cookie.get(module.settings.membership.cookie.userId);
    if (typeof this.isLoggedIn !== 'undefined' || currCookie === "") {
      if(this.isLoggedIn) {
        module.PubSub.publish("dalton.success.user.isLoggedIn");
      }
      else {
        this.isLoggedIn = false;
        module.PubSub.publish("dalton.failure.user.isLoggedIn");
      }
    }
    else {
      if (module.membership.isLoggedIn()) {
        this.isLoggedIn = true;
        var cookie = JSON.parse(currCookie);
        this.entitlements = cookie.entitlements;
        module.PubSub.publish("dalton.success.user.isLoggedIn");
        if (!this.ssoChecked) {
          module[ns].ssoCheck();
        }
      }
      else {
        this.isLoggedIn = false;
        module.PubSub.publish("dalton.failure.user.isLoggedIn");
      }
    }
  };

  module[ns].getUserData = function getUserData() {
    var moduleCallback = function(msg) {

    };

    module.membership.getUserData(moduleCallback, moduleCallback);
  };

  module[ns].updateUserAttr = function updateUserAttr(attr, operator) {
    var action = (operator && operator.toLowerCase() === 'delete') ? 'deleteData' : 'putData';

    if(action === 'deleteData') {
      module.PubSub.publish("membership.delete.follow.attributes", attr);
    }
    else {
      module.PubSub.publish("membership.post.follow.attributes", attr);
    }
  };

  module[ns].classicGameEntitlement = function classicGameEntitlement(games) {
    if(this.entitlements.length > 0) {
      function postClassicStreamAccess(msg) {
        var environmentQuery = '',
          urlBase = '';

        if (window.drupalSettings && window.drupalSettings.SDATA_URL_PATH && window.drupalSettings.SDATA_URL_PATH !== 'prod') {
          urlBase = window.drupalSettings.SDATA_URL_BASE;
          if (urlBase.indexOf('//') === 0) {
            urlBase = 'http:' + urlBase;
          }
          environmentQuery = '?env=' + urlBase + '/' + window.drupalSettings.SDATA_URL_PATH + '/v2/';
        }

        module.membership.postData({
          contentType: "application/json",
          messages: {
            success: "dalton.success.classic.games.entitlement",
            failure: "dalton.failure.classic.games.entitlement"
          },
          url: s.servers.ids + "/streamaccess/api/1/streamaccess/classic/" + environmentQuery,
          data: {
            "daltonAuthorizationToken": module.membership.authsignature.get(),
            "gameIds": games
          }
        });
      }

      if (!entitlementsSet) {
        module.PubSub.subscribe('membership.success.cookie.entitlements.set', postClassicStreamAccess);
      }
      else {
        postClassicStreamAccess();
      }
    }
    else {
      module.PubSub.publish("dalton.failure.classic.games.entitlement");
    }
  };

  module[ns].gameIdEntitlement = function gameIdEntitlement(games) {
    game[0] = games;
    var gameIdEntitlementToken = module.PubSub.subscribe('dalton.success.secure.geo', postStreamAccess);

    function getGeo(msg) {
      module.membership.getData({
        contentType: "application/json",
        messages: {
          success: "dalton.success.secure.geo",
          failure: "dalton.failure.secure.geo"
        },
        url: "https://blackout.lp.nba.com/api/v2/token"
      });

      module.PubSub.unsubscribe(cookieToken);
    }

    function postStreamAccess(msg, data) {
      var environmentQuery = '',
        urlBase = '';

      if (window.drupalSettings && window.drupalSettings.SDATA_URL_PATH && window.drupalSettings.SDATA_URL_PATH !== 'prod') {
        urlBase = window.drupalSettings.SDATA_URL_BASE;
        if (urlBase.indexOf('//') === 0) {
          urlBase = 'http:' + urlBase;
        }
        environmentQuery = '?env=' + urlBase + '/' + window.drupalSettings.SDATA_URL_PATH + '/v2/';
      }

      module.membership.postData({
        contentType: "application/json",
        messages: {
          success: "dalton.internal.success.games.entitlement",
          failure: "dalton.failure.games.entitlement"
        },
        url: s.servers.ids + "/streamaccess/api/1/streamaccess/" + environmentQuery,
        data: {
          "daltonAuthorizationToken": module.membership.authsignature.get(),
          "games": game
        }
      });

      module.PubSub.unsubscribe(gameIdEntitlementToken);
    }

    if (!entitlementsSet) {
      var cookieToken = module.PubSub.subscribe('membership.success.cookie.entitlements.set', getGeo);
      module.PubSub.publish('membership.set.cookie.entitlements');
    }
    else {
      getGeo();
    }
  };

  module[ns].moduleCallback = function moduleCallback(msg, data) {
    switch(msg) {
      case 'membership.authorized.sso.check':
        module.PubSub.publish('dalton.authorized.ssoCheck');
        break;
      case 'membership.failure.sso.check':
        module.PubSub.publish('dalton.failure.ssoCheck');
        break;
      case 'membership.unauthorized.sso.check':
        module.PubSub.publish('dalton.unauthorized.ssoCheck');
        break;
      case 'membership.success.cookie.entitlements.set':
        entitlementsSet = true;
        var currCookie = module.cookie.get(module.settings.membership.cookie.userId);
        var cookie = JSON.parse(currCookie);
        this.entitlements = cookie.entitlements;
        module.PubSub.publish('dalton.success.cookie.updated', cookie);
        break;
      case 'membership.failure.cookie.entitlements.get':
        module.PubSub.publish('dalton.failure.cookie.updated');
        break;
    }
  };

  module[ns].ssoCheck = function ssoCheck() {
    if (!this.ssoChecked) {
      module.PubSub.publish("membership.check.sso");
      this.ssoChecked = true;
    }
  };

  module[ns].setTeamEntitlement = function setTeamEntitlement(team) {
    module.membership.postData({
      authorization:module.membership.authcode.get(),
      contentType:"application/json",
      messages:{
        success:"dalton.success.update.choiceteams.entitlement",
        failure:"dalton.failure.update.choiceteams.entitlement"
      },
      url:s.servers.ids+"/choiceteams/api/"+s.apiVersion.ids+"/choiceteams",
      data:{
        teams:[team]
      }
    });
  };

  module[ns].getTeamEntitlement = function getTeamEntitlement() {
    if (this.isLoggedIn && this.entitlements.length > 0) {
      module.membership.getData({
        authorization: module.membership.authcode.get(),
        contentType: "application/json",
        messages: {
          success: "dalton.success.get.choiceteams.entitlement",
          failure: "dalton.failure.get.choiceteams.entitlement"
        },
        url: s.servers.ids + "/choiceteams/api/" + s.apiVersion.ids + "/choiceteams"
      });
    }
  };

  module[ns].getUnauthenticatedStreamAccess = function getUnauthenticatedStreamAccess(games) {
    game[0] = games;

    module.PubSub.subscribe('dalton.success.secure.geo', function(msg, data) {
      var environmentQuery = '',
        urlBase = '';

      if (window.drupalSettings && window.drupalSettings.SDATA_URL_PATH && window.drupalSettings.SDATA_URL_PATH !== 'prod') {
        urlBase = window.drupalSettings.SDATA_URL_BASE;
        if (urlBase.indexOf('//') === 0) {
          urlBase = 'http:' + urlBase;
        }
        environmentQuery = '?env=' + urlBase + '/' + window.drupalSettings.SDATA_URL_PATH + '/v2/';
      }

      module.membership.postData({
        contentType: "application/json",
        messages: {
          success: "dalton.internal.success.games.entitlement",
          failure: "dalton.failure.games.entitlement"
        },
        url: s.servers.ids + "/streamaccess/api/1/streamaccess/" + environmentQuery,
        data: {"games":game}
      }, true);
    });

    module.membership.getData({
      contentType: "application/json",
      messages: {
        success: "dalton.success.secure.geo",
        failure: "dalton.failure.secure.geo"
      },
      url: "https://blackout.lp.nba.com/api/v2/token"
    }, true);

  };

  module[ns].setFPGameEntitlement = function setFPGameEntitlement(msg, data) {
    var isFreePreview = false,
        isFreePreviewEntitled = false,
        isUserEntitled = false;

    if (window.drupalSettings && window.drupalSettings.free_preview && window.drupalSettings.free_preview !== 'none') {
      isFreePreview = true;
    }

    if (this.isLoggedIn && isFreePreview) {
      for (var i = 0; i < this.entitlements.length;i++) {
        if (this.entitlements[i] === isFreePreview) {
          isFreePreviewEntitled = true;
        }
      }
    }

    if (this.entitlements && this.entitlements.length > 0) {
      for (var i = 0;i < this.entitlements.length;i++) {
        if(this.entitlements[i] === 'lpbpnb' || this.entitlements[i] === 'lpbp') {
          isUserEntitled = true;
          break;
        }
      }
    }

    if (data && data.gamePermissions) {
      for (var i = 0; i < data.gamePermissions.length; i++) {
        data.gamePermissions[i].isFreePreview = isFreePreview;
        data.gamePermissions[i].isUserEntitled = isUserEntitled;
        data.gamePermissions[i].isFreePreviewEntitled = isFreePreviewEntitled;
      }
    }

    module.PubSub.publish("dalton.success.games.entitlement", data);
  };

  module[ns].init();

})(jQuery, "dalton", window._nba = window._nba || {}, window.membership_settings = window.membership_settings || {});
