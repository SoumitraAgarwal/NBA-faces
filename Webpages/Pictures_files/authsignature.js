/**
 * This is the NBA Membership Authsignature namespace.
 * This will handle all base membership functionality.
 * @namespace _nba.membership.authsignature
 * @memberof! <global>
 */

;(function _MembershipAuthsignatureInitWrapper(namespace,subNamespace,authsignature,settings,ns,w,d) {
  "use strict";
  if (ns) {
    ns.safeCreate([namespace,subNamespace]);
  }

  w[namespace][subNamespace][authsignature] = w[namespace][subNamespace][authsignature] ||
    (function _MembershipAuthsignatureInit(w,d,undefined) {
      var my = {},
        currAuthsignature = "",
        data = {},
        initialized = false,
        type = "membership.authsignature";

      /* Everything related to the authsignature */
      function get() {
        return (currAuthsignature || undefined);
      }

      function remove() {
        currAuthsignature = "";
        return true;
      }

      function set(code) {
        if (code) {
          currAuthsignature = code;
          return true;
        } else {
          return false;
        }
      }

      /* Everything related to the authsignature */
      my.get = get;
      my.remove = remove;
      my.set = set;

      /* This is where you return all of your public methods. */
      return my;

    }(
      w,
      d));

  /* END: The main logic for the namespace. */

  /* Below we are using global CMS3 variables to set the main NBA namespace and
   * namespace for settings. Also we pass in the namespace tools, etc. */
}(window.membership_settings.jsNamespace,"membership","authsignature",window.membership_settings.jsSettings,window._nbaNamespaceTools,window,document));