/* This file can be used for adding in polyfills that we want available to _nba.*
 * namespaces. This is for instances where we don't have things like jQuery available.
 * The analytics and cvp namespaces are good examples where we would want to use these
 * polyfills as they will be shared on sites we don't control.
 */

;(function(polyfill,namespace,ns,w,d) {

  ns.safeCreate([namespace,polyfill]);

  /* This is used for attaching functions to events. */
  /* TODO: Once IE8 finally dies, this function will no longer be needed. */
  if("undefined" === typeof w[namespace][polyfill].addEvent){
    function addEvent(element, event, fn) {
      if (element.addEventListener) {
        element.addEventListener(event, fn, false);
      } else if (element.attachEvent) {
        if ((element === document && event==="DOMContentLoaded") || (element !== window && event==="load")) {
          element.attachEvent("onreadystatechange",function(){if(element.readyState==="complete" || element.readyState==="loaded"){fn();}});
        } else {
          element.attachEvent("on" + event, fn);
        }
      }
    }
    w[namespace][polyfill].addEvent = addEvent;
  }

  /* Added Polyfill for IE11. */
  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes */

  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.includes called on null or undefined');
      }

      var O = Object(this);
      var len = parseInt(O.length, 10) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1], 10) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {k = 0;}
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
           (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
          return true;
        }
        k++;
      }
      return false;
    };
  }

  /* The following document.currentScript Polyfill is slightly modified from: https://gist.github.com/cphoover/6228063#file-gistfile1-txt
   * Unfortunately this only works in a limited fashion on Internet Explorer (can only handle if one occurrence of a script is on a page).
   * Only works for IE10+
   * */
  if("undefined" === typeof w[namespace][polyfill].currentScript){
    (function _currentScript(){
      /***************************************************************************/
      /* document.currentScript polyfill + improvements */
      /***************************************************************************/
      var scripts = d.getElementsByTagName('script');

      // return script object based off of src
      var getScriptFromURL = function(url) {
        for (var i = 0; i < scripts.length; i++) {
          if (scripts[i].src === url) {
            return scripts[i];
          }
        }

        return undefined;
      }

      var actualScript = w[namespace][polyfill].actualScript = function() {

        var stack;
        /*try {
          fail
        } catch(e) {
          stack = e.stack;
        };*/

        if (!stack) {
          return undefined;
        }

        var e = stack.indexOf(' at ') !== -1 ? ' at ' : '@',stackUrl;

        while (stack.indexOf(e) !== -1) {
          stack = stack.substring(stack.indexOf(e) + e.length);
          stack = stack.substring(0, stack.indexOf(':', stack.indexOf(':')+1));
          stackUrl = stack.match(/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
        }

        return getScriptFromURL(stackUrl[0]);
      };
      if (d.currentScript) {
        Object.defineProperty(w[namespace][polyfill],'currentScript',{get:function(){return d.currentScript}});
      } else if (Object.defineProperty) {
        //Object.defineProperty(w[namespace][polyfill],'currentScript',{get:actualScript});
      }
    })();
  }

  if("undefined" === typeof w[namespace][polyfill].deepExtend){
    function deepExtend(destination, source) {
      for (var property in source) {
        if (source[property] && source[property].constructor &&
          source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          deepExtend(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }
    w[namespace][polyfill].deepExtend = deepExtend;
  }

  if("undefined" === typeof w[namespace][polyfill].processOverrides){
    function processOverrides(defaults,overrides) {

      if (defaults && overrides) {
        for (var prop in overrides) {
          if (defaults[prop] && typeof defaults[prop] === "object") {
            defaults[prop] = processOverrides(defaults[prop],overrides[prop]);
          } else if (overrides[prop]) {
            defaults[prop] = overrides[prop];
          }
        }
        return defaults;
      }
    }
    w[namespace][polyfill].processOverrides = processOverrides;
  }
}("polyfill","_nba",window._nbaNamespaceTools,window,document));