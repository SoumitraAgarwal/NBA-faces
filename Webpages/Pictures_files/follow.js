/**
 * This is the NBA Membership Follow namespace.
 * @namespace _nba.membership.follow
 * @memberof! <global>
 */

;(function _MembershipSsoFollowWrapper(namespace,subNamespace,follow,settings,ns,w,d) {
  "use strict";
  if (ns) {
    ns.safeCreate([namespace,subNamespace]);
  }

  w[namespace][subNamespace][follow] = w[namespace][subNamespace][follow] ||
    (function _MembershipFollowInit(s,membership,authcode,errorHandler,cookie,pubsub,gl,w,d,undefined) {
      var my = {},
        initialized = false,
        type = "",
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
        pubsub.subscribe("membership.set.follow.attributes",setFollowItems);
        pubsub.subscribe("membership.get.follow.attributes",getFollowItems);
        pubsub.subscribe("membership.get.success.follow",getSuccessFollowItems);
        pubsub.subscribe("membership.post.success.storage.follow",followSuccess);
        pubsub.subscribe("membership.delete.success.storage.follow",followSuccess);
        pubsub.subscribe("membership.set.registration.follow",setRegistrationFollow)
        pubsub.subscribe("membership.post.follow.attributes", postFollow);
        pubsub.subscribe("membership.delete.follow.attributes", deleteFollow);

        /*initialize Modernizr.localstorage for personalization*/
        w.Modernizr.addTest('localstorage', function() {
          var mod = 'modernizr';
          try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
          } catch (e) {
            return false;
          }
        });
      }

      function deleteFollow(msg, data) {
        for (var key in data) {
          membership.deleteData({
            authorization: authcode.get(),
            contentType: "application/json",
            messages: {
              success: "membership.delete.success.storage.follow",
              failure: "membeship.delete.failure.storage.follow"
            },
            url: s.servers.ids + "/preferences/api/" + s.apiVersion.ids + "/preferences/" + key + "/" + data[key]
          });
        }
      }

      function followSuccess(msg, data) {
        w.Personalize.replace(data.collection, data.selections);
      }

      function getFollowItems(msg) {
        membership.getData({
          authorization: authcode.get(),
          contentType: "application/json",
          messages: {
            success: "membership.get.success.follow",
            failure: "membership.get.failure.follow"
          },
          url: s.servers.ids + "/preferences/api/" + s.apiVersion.ids + "/preferences/"
        });
      }

      function getSuccessFollowItems(msg, data) {
        var preferences = data.preferences;
        // Reset is needed here to clear saved preferences on empty collection.
        // If the collection is empty, thus not present, the cookie needs to be reset.
        w.Personalize.reset();
        if(preferences.length > 0) {
          for(var i=0;i<preferences.length;i++) {
            w.Personalize.replace(preferences[i].collection, preferences[i].selections);
          }
        }
        pubsub.publish("membership.set.success.follow");
      }

      function postFollow(msg, data) {
        for (var key in data) {
          membership.putData({
            authorization: authcode.get(),
            contentType: "application/json",
            messages: {
              success: "membership.post.success.storage.follow",
              failure: "membeship.post.failure.storage.follow"
            },
            url: s.servers.ids + "/preferences/api/" + s.apiVersion.ids + "/preferences/" + key + "/" + data[key]
          });
        }
      }

      function setFollowItems(msg, data) {
        for (var key in data) {
          if(w.Array.isArray(data[key])) {
            for(var i=0;i<data[key].length;i++) {
              var info = {};
              info[key] = data[key][i];
              pubsub.publish("membership.post.follow.attributes", info);
            }
          }
          else {
            pubsub.publish("membership.post.follow.attributes", data);
          }
        }
      }

      function setRegistrationFollow(msg) {
        var players = w.Personalize.get('player');
        var teams = w.Personalize.get('team');
        var data = {};
        if (w.Array.isArray(players)) {
          data.player = players;
        }
        if (w.Array.isArray(teams)) {
          data.team = teams;
        }
        pubsub.publish("membership.set.follow.attributes", data);
      }

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
}(window.membership_settings.jsNamespace,"membership","follow",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));