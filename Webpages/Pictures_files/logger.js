/* Simple universal logger.
 * To enabled debugging, set "_nba.settings.global.debug=true;" or add debug=true to the querystring.*/
;(function(namespace,settings,w,d) {
	if (!w[namespace]) {
		w[namespace] = {};
	}
	if (!w[namespace][settings]) {
		w[namespace][settings] = {};
	}
	if (!w[namespace].logger) {
		w[namespace].logger = (function Logger(settingsObj,namespace,w,d,undefined) {
			var my = {},
			instances = {};
	
			my.getInstance = function getInstance(name) {
				if (!instances[name]) {
					instances[name] = _setInstance(name,namespace,settingsObj);
				}
				return instances[name];
			}
	
			function _setInstance(name,namespace,settingsObj) {
				var my = {};
	
				my.error = function error(msg) {
					_log("error",msg);
				}
	
				my.info = function info(msg) {
					_log("info",msg);
				}
	
				my.log = function log(msg) {
					_log("log",msg);
				}
	
				my.warn = function warn(msg) {
					_log("warn",msg);
				}
	
				function _log(level,msg) {
					//Make sure IE8 and below behave with console.log.
					(w.console&&((settingsObj.global&&settingsObj.global.debug===true || settingsObj.global&&settingsObj.global.debug=="true")||(settingsObj[name]&&settingsObj[name].debug===true || settingsObj[name]&&settingsObj[name].debug=="true")||(location.search.indexOf("debug=true")!=-1))?w.console[level](namespace+"."+name+": "+msg):undefined);
				}
	
				return my;
			}
	
			return my;
		}(w[namespace][settings],
		  namespace,
		  w,
		  d));
	}
}(window.membership_settings.jsNamespace,window.membership_settings.jsSettings,window,document));