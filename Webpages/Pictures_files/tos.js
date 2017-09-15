/**
 * This is the Terms of Service (TOS) namespace.
 * This namespace just creates the Terms of Service ribbon.
 * This may eventually be rolled into an _nba.ribbon namespace.
 * @namespace _nba.tos
 * @memberof! <global>
 */
;(function _nbaTermsOfService(tos,namespace,subNamespace,w,d) {
  Drupal.behaviors.nbaTos = {
    attach: function (context, settings, drupalSettings) {

      var appRegex = /app=([a-z]*[A-Z]*)/,
        isApp;

      if (window.location.search.match(appRegex)) {
        isApp = window.location.search.match(appRegex)[1];
        if (isApp === "true") {
          isApp = true;
        } else {
          isApp = false;
        }
      } else {
        isApp = false;
      }

      //Create the _nba namespace if not there.
      w[namespace] = w[namespace] || {};

      w[namespace][subNamespace] = w[namespace][subNamespace] ||
        (function _tos(id, pf, w, d, undefined) {
          var my = {},
            notloaded = true,
            type = subNamespace;

          /* Initialize the TOS Banner. */
          function init() {
            if (notloaded) {
              var showTOS,
                cdn = getCDN(),
                tosCss = '#nba_tos {position:fixed;bottom:0px;left:0px;width:100%;background:#fff;border-top:15px solid #cc1046;z-index:1000;}\
					  #nba_tos_inner {min-height: 60px;padding:5px 10%; border-top: 2px solid #ccc; font-size: 14px; line-height: 20px;-webkit-text-size-adjust: none;}\
					  #nba_tos_close_button {background: url("' + cdn + '/nba/.element/img/3.0/sect/footer/agree_close.png") no-repeat scroll 0 0 transparent;display: block;height: 40px;width: 40px;margin: 10px auto;border:none;cursor:pointer;}\
					  #nba_tos a,#nba_tos a:hover,#nba_tos a:active,#nba_tos a:visited {color:#06c;font-weight:normal;text-decoration:underline;}\
					  @media screen and (min-width:440px) {\
						 #nba_tos_inner {padding-right: 15%;}\
						 #nba_tos_close_button {position: absolute;right: 5px;top: 10px;margin: 0; }\
					  }\
					  @media screen and (min-width:520px) {\
						 #nba_tos_inner {padding-right: 10%;}\
					  }',
                tosCode = '<div id="nba_tos"><div id="nba_tos_inner">\
				  NBA sites use cookies and similar technologies.  By using NBA sites, you are agreeing to our revised <a href="/news/privacy_policy.html" target="_blank">Privacy Policy</a> and <a href="/news/termsofuse.html " target="_blank">Terms of Service</a>, including our <a href="/news/privacy_policy.html#cookies" target="_blank">Cookie Policy.</a>\
				  <button id="nba_tos_close_button" aria-label="close terms of service"></button>\
				</div></div>';

              if (typeof(w.Storage) !== "undefined") {
                showTOS = (w.localStorage.getItem(id) !== "Accept") && (d.cookie.indexOf(id) === -1);
              } else {
                showTOS = d.cookie.indexOf(id) === -1;
              }
              if (showTOS) {
                loadStyleSheet(tosCss);
                d.body.insertAdjacentHTML('afterbegin', tosCode);
                var button = d.getElementById("nba_tos_close_button");
                pf.addEvent(button, "click", close);
                pf.addEvent(button, "keypress", close);
              }
              notloaded = false;
            }
          }

          /* Close the TOS banner and set the local storage. */
          function close() {
            var elem = d.getElementById("nba_tos");
            if (elem) {
              elem.parentNode.removeChild(elem);
            }
            try {
              w.localStorage.setItem(id, "Accept");
            } catch (e) {
              d.cookie = id + "=accept; expires=Wed, 1 Jan 2020 12:00:00 GMT; path=/";
            }
          }

          function getCDN() {
            if (window.location.protocol.match(/https/i)) {
              return 'https://s.cdn.turner.com/nba';
            } else {
              return 'http://i.cdn.turner.com/nba';
            }
          }

          /* This dynamically sets the style sheet.  Needed for IE8 through IE11. */
          function loadStyleSheet(z) {
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
              try {
                document.createStyleSheet().cssText = z;
              } catch (e) {
                if (document.styleSheets[0]) {
                  document.styleSheets[0].cssText += z;
                }
              }
            } else {
              var ea = document.createElement('style');
              ea.type = 'text/css';
              ea.textContent = z;
              document.getElementsByTagName('head')[0].appendChild(ea);
            }
          }

          /* Expose only the functions we want people to use. */
          my.close = close;

          /* If the document body already exists, then fire off immediately, otherwise attach to page-load events. */
          if (!isApp) {
            if (d.body) {
              init();
            } else {
              //Initialize with the DOM is ready.
              pf.addEvent(d, "DOMContentLoaded", init);
              pf.addEvent(w, "load", init);
            }
          }

          /* This is where you return all of your public methods. */
          return my;

        }(tos,
          w[namespace]["polyfill"],
          w,
          d));

      /* Below we are using global CMS3 variables to set the main NBA namespace and
       * namespace for settings. Also we pass in the namespace tools, etc. */
    }
  };
}("NBATOS20150305","_nba","tos",window,document));
