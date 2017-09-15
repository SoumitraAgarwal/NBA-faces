;(function _MembershipUserLoginInitWrapper(namespace,subNamespace,settings,ns,w,d) {
    "use strict";
    (function _MembershipUserLoginInit(s,membership,analytics,cookie,querystring,storage,gl,pubsub,authcode,w,d,undefined) {


            var imageBasePath = (w.location.protocol == "http:"?window.membership_settings.cdnNonSecureImage:window.membership_settings.cdnSecure),
            scriptBasePath = (w.location.protocol == "http:"?window.membership_settings.cdnNonSecure:window.membership_settings.cdnSecure);

            var navcss = document.createElement('link'),
                head = document.getElementsByTagName('head')[0];
            navcss.rel = "stylesheet";
            navcss.type = "text/css";
            if ((window.location.href.search(/leaguepasssupport.nba.com/) !== -1) || (document.domain == 'leaguepasssupport.nba.com')) {
                navcss.href = 'https://s.cdn.turner.com/nba/nba/.element/sect/lpsupport/css/pkgMembershipImportCommon-min.css';
            } else {
                navcss.href=scriptBasePath+"/static/nba-cms3-storefront/latest/css/pkgMembershipImportCommon-min.css";
            }
            head.appendChild(navcss);

            var navAcct = {
                initialized:false,
                defaults:{
                    mainTarget:'#navAccount',
                    dropdownTarget: '#navAccthover',
                    respTarget: '#respNavAcct',
                    loggedin: '#loggedinnow',
                    chkResp: '#main-nav',
                    dataString: 'data-membership-action',
                    dataStringType:['dynamic-login', 'register','settings', 'watch'],
                    cookieName: s.cookie.userId,
                    helpType:['http://help.NBA.com', 'http://leaguepasssupport.nba.com'],
                    teamFeed: 'http://data.nba.com/data/json/cms/regularseason/sportsmeta/nba_teams.json',
                    teamFeedSec: '/membership/proxy/team/',
                    entitleArray: [{
                            'entitlement': 'lpbpnb',
                            'rank': 5,
                            'type': 'VIP League Pass'
                        },{
                            'entitlement': 'lpbp',
                            'rank': 4,
                            'type': 'League Pass'
                        },{
                            'entitlement': 'lpbfp',
                            'rank': 3,
                            'type': 'Free Trial'
                        },{
                            'entitlement': 'lpbc',
                            'rank': 2,
                            'type': 'League Pass Choice Pass'
                        },{
                            'entitlement': 'lpsg',
                            'rank': 1,
                            'type': 'League Pass Single Game'
                        },{
                            'entitlement': 'lprdo',
                            'rank': 0,
                            'type': 'League Pass Radio'
                    }]  

            },
            init: function(){
                if (!navAcct.initialized) {
                    navAcct.chkNBACookie();
                    pubsub.subscribe('membership.unauthorized.sso.check', navAcct.chkNBACookie);
                    pubsub.subscribe('membership.failure.cookie.standard.check', navAcct.chkNBACookie);
                    pubsub.subscribe('membership.success.cookie.standard.update', navAcct.chkNBACookie);
                    membership.scanExternalCallbacks();
                    navAcct.initialized = true;
                }
            },
            chkNBACookie:function(){
                var defaults = navAcct.defaults,
                nbaCookie = _nba.cookie.get(defaults.cookieName),
                linkType,respHeader = navAcct.chkRespHeader();

                if(nbaCookie.length > 0){
                    linkType = 1;
                    var nbaCookieData = w.JSON.parse(nbaCookie);

                        if(nbaCookieData.entitlements && nbaCookieData.entitlements.indexOf("lpbc") > -1 ){
                            if(nbaCookieData.teams && nbaCookieData.teams != 0){
                                   navAcct.getTeam(nbaCookieData.teams[0]);
                            }else if(nbaCookieData.teams && nbaCookieData.teams == ''){
                                    navAcct.getTeam(0);
                            }else if(!nbaCookieData.teams){
                                    navAcct.getTeam(0);
                            }
                        }
                      
                      navAcct.setAcctHeader(linkType,nbaCookieData);
                }else{
                    linkType = 0;
                    navAcct.setAcctHeader(linkType);
                }
            },
            chkRespHeader: function(){
                var defaults = navAcct.defaults,
                respHeader;
                respHeader = jQuery(defaults.chkResp).length > 0 ? respHeader = true : respHeader = false;
                return respHeader;
            },
            setAcctHeader:function(type,data){
                var defaults = navAcct.defaults,
                    respHeader = navAcct.chkRespHeader();

                switch(type){
                    //not logged in
                    case 0:
                        var output = '<div class="navAccoutLinks"><a class="not_signed_in" ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign In</a></div>';
                        output += '<div class="navAccoutLinks"><a class="not_signed_in" '+defaults.dataString+'='+defaults.dataStringType[1]+'>Create Account</a></div>';
                        output += '<div class="navAccoutLinks"><a class="help_link" href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                        output += '<div class="navAccoutLinks watch_box"><a '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><span class="icon-lpTv"></span>Watch Games</a></div>';

                            if(respHeader){
                                var resp_output = '<div class="top_resp_nav"><a href="" '+defaults.dataString+'='+defaults.dataStringType[1]+' class="left_resp">Create Account</a></div>';
                                resp_output += '<div class="bot_resp_nav">';
                                resp_output += '<div class="bot_resp_nav_links"><a href="" '+defaults.dataString+'='+defaults.dataStringType[0]+'>Sign In</a></div>';
                                resp_output += '<div class="bot_resp_nav_links lp_watch"><a href="" '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><img src="'+imageBasePath+"@static2:elements/headerv2/watch_games_resp.png@"+'" />Watch Games</a></div>';
                                resp_output += '<div class="bot_resp_nav_links"><a href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                                resp_output += '</div>';
                            }
                    break;

                    case 1:
                        var entitleType;
                        
                            if(!data.entitlements){
                                entitleType = 'no_subscrip';
                            }
                            else if(data.entitlements == ""){
                                entitleType = 'no_subscrip';
                            }
                            else if(data.entitlements && data.entitlements.length > 1){
                                entitleType = navAcct.rankEntitlements(data.entitlements);
                            }
                            else{
                                entitleType = data.entitlements[0];
                            }
                        
                            switch(entitleType){

                                //regular account
                                case 'no_subscrip':
                                    var output = '<div id="loggedinnow" class="navAccoutLinks reg_signed_in"><a style="font-weight:bold;"">'+data.email+'</a></div>';
                                    output += '<div class="navAccoutLinks"><a href="'+defaults.helpType[1]+'" target="_blank" class="help_link">Help</a></div>';
                                    output += '<div class="navAccoutLinks watch_box"><a '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><span class="icon-lpTv"></span>Watch Games</a></div>';
                                    navAcct.buildDropdown(entitleType,data);

                                        if(respHeader){
                                            var resp_output = '<div class="resp_acct_detail"><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                                            resp_output += '<div class="top_resp_nav resp_signed_in"><img src="'+imageBasePath+"@static2:elements/headerv2/lpBasicUser.png@"+'" /><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'><span class="resp_text_overflow">'+data.email+'</span></a>';
                                            resp_output += '</div>';
                                            resp_output += '<div class="mid_resp_nav"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank"><img src="'+imageBasePath+"@static2:elements/headerv2/arrow_resp.png@"+'" />Upgrade to NBA LEAGUE PASS</a></div>';
                                            resp_output += '<div class="bot_resp_nav">';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="" '+defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links lp_watch"><a href="" '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav" target="_blank"><img src="'+imageBasePath+"@static2:elements/headerv2/watch_games_resp.png@"+'" />Watch Games</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                                            resp_output += '</div>';
                                        }
                                break;

                                case defaults.entitleArray[0].entitlement:
                                case defaults.entitleArray[1].entitlement:
                                 var output_type = navAcct.getAcctType(entitleType);
                                 var output = '<div id="loggedinnow" class="navAccoutLinks league_pass_signed_in"><img src="'+imageBasePath+"@static2:elements/headerv2/lpLPUser.png@"+'" /><a style="font-weight:bold;">'+data.email+'</a><p>'+output_type+'</p></div>';
                                    output += '<div class="navAccoutLinks"><a href="'+defaults.helpType[1]+'" target="_blank" class="help_link">Help</a></div>';
                                    output += '<div class="navAccoutLinks watch_box"><a '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><span class="icon-lpTv"></span>Watch Games</a></div>';
                                    navAcct.buildDropdown(entitleType,data);

                                        if(respHeader){
                                            var resp_output = '<div class="resp_acct_detail"><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                                            resp_output += '<div class="top_resp_nav resp_league_pass_signed_in"><img src="'+imageBasePath+"@static2:elements/headerv2/lpLPUser.png@"+'" /><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'><span class="resp_text_overflow">'+data.email+'</span></a><p>'+output_type+'</p>';
                                            resp_output += '</div>';
                                            resp_output += '<div class="bot_resp_nav">';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="" ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links lp_watch"><a href="" '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><img src="'+imageBasePath+"@static2:elements/headerv2/watch_games_resp.png@"+'" />Watch Games</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                                            resp_output += '</div>';
                                        }
                                break;

                                //team
                                case defaults.entitleArray[3].entitlement:
                                    var output_type = navAcct.getAcctType(entitleType);
                                    var output = '<div id="loggedinnow" class="navAccoutLinks choice_single_signed_in"><a style="font-weight:bold;">'+data.email+'</a>';
                                    output += '<p>'+output_type+'&nbsp;';
                                    output += '<span class="team_name"></span>';
                                    output += '</p></div>';
                                    output += '<div class="navAccoutLinks"><a href="'+defaults.helpType[1]+'" target="_blank" class="help_link">Help</a></div>';
                                    output += '<div class="navAccoutLinks watch_box"><a '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><span class="icon-lpTv"></span>Watch Games</a></div>';
                                    navAcct.buildDropdown(entitleType,data);

                                        if(respHeader){
                                            var resp_output = '<div class="resp_acct_detail"><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                                            resp_output += '<div class="top_resp_nav resp_choice_signed_in"><img src="'+imageBasePath+"@static2:elements/headerv2/lpSingleGame.png@"+'" /><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'><span class="resp_text_overflow">'+data.email+'</span></a>';
                                            resp_output += '<p>'+output_type+'&nbsp;';
                                            resp_output += '<span class="team_name_resp"></span>';
                                            resp_output += '</p></div>';
                                            resp_output += '<div class="mid_resp_nav"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank"><img src="'+imageBasePath+"@static2:elements/headerv2/arrow_resp.png@"+'" />Upgrade to NBA LEAGUE PASS</a></div>';
                                            resp_output += '<div class="bot_resp_nav">';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="" ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links lp_watch"><a href="" '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><img src="'+imageBasePath+"@static2:elements/headerv2/watch_games_resp.png@"+'" />Watch Games</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                                            resp_output += '</div>';
                                        }
                                break;

                                case defaults.entitleArray[2].entitlement:
                                case defaults.entitleArray[4].entitlement:
                                case defaults.entitleArray[5].entitlement:
                                    var output_type = navAcct.getAcctType(entitleType);
                                    var output = '<div id="loggedinnow" class="navAccoutLinks choice_single_signed_in"><a style="font-weight:bold;">'+data.email+'</a>';
                                    output += '<p>'+output_type+'</p></div>';
                                    output += '<div class="navAccoutLinks"><a href="'+defaults.helpType[1]+'" target="_blank" class="help_link">Help</a></div>';
                                    output += '<div class="navAccoutLinks watch_box"><a '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><span class="icon-lpTv"></span>Watch Games</a></div>';
                                    navAcct.buildDropdown(entitleType,data);

                                        if(respHeader){
                                            var resp_output = '<div class="resp_acct_detail"><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                                            resp_output += '<div class="top_resp_nav resp_choice_signed_in"><img src="'+imageBasePath+"@static2:elements/headerv2/lpSingleGame.png@"+'" /><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'><span class="resp_text_overflow">'+data.email+'</span></a><p>'+output_type+'</p>';
                                            resp_output += '</div>';
                                            resp_output += '<div class="mid_resp_nav"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank"><img src="'+imageBasePath+"@static2:elements/headerv2/arrow_resp.png@"+'" />Upgrade to NBA LEAGUE PASS</a></div>';
                                            resp_output += '<div class="bot_resp_nav">';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="" ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links lp_watch"><a href="" '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><img src="'+imageBasePath+"@static2:elements/headerv2/watch_games_resp.png@"+'" />Watch Games</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                                            resp_output += '</div>';
                                        }
                                break;

                                default:
                                    var output = '<div id="loggedinnow" class="navAccoutLinks reg_signed_in"><a style="font-weight:bold;"">'+data.email+'</a></div>';
                                    output += '<div class="navAccoutLinks"><a href="'+defaults.helpType[1]+'" target="_blank" class="help_link">Help</a></div>';
                                    output += '<div class="navAccoutLinks watch_box"><a '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav"><span class="icon-lpTv"></span>Watch Games</a></div>';
                                    navAcct.buildDropdown(entitleType,data);

                                        if(respHeader){
                                            var resp_output = '<div class="resp_acct_detail"><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                                            resp_output += '<div class="top_resp_nav resp_signed_in"><img src="'+imageBasePath+"@static2:elements/headerv2/lpBasicUser.png@"+'" /><a href="" '+defaults.dataString+'='+defaults.dataStringType[2]+'><span class="resp_text_overflow">'+data.email+'</span></a>';
                                            resp_output += '</div>';
                                            resp_output += '<div class="mid_resp_nav"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank"><img src="'+imageBasePath+"@static2:elements/headerv2/arrow_resp.png@"+'" />Upgrade to NBA LEAGUE PASS</a></div>';
                                            resp_output += '<div class="bot_resp_nav">';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="" '+defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links lp_watch"><a href="" '+defaults.dataString+'='+defaults.dataStringType[3]+' data-membership-analytics="gnav" target="_blank"><img src="'+imageBasePath+"@static2:elements/headerv2/watch_games_resp.png@"+'" />Watch Games</a></div>';
                                            resp_output += '<div class="bot_resp_nav_links"><a href="'+defaults.helpType[1]+'" target="_blank">Help</a></div>';
                                            resp_output += '</div>';
                                    }

                            }
                    break;
                }

                    
                        jQuery(defaults.mainTarget).empty();
                        jQuery(defaults.respTarget).empty();
                        
                        jQuery(defaults.mainTarget).append(output);
                        navAcct.initDropDown();
                            if(respHeader){
                                jQuery(defaults.respTarget).append(resp_output);
                            }
                    
            },
            buildDropdown: function(entitleType, data){
                var defaults = navAcct.defaults;

                switch(entitleType){

                    //regular account
                    case 'no_subscrip':
                    var output = '<div class="navAccoutLinksHover reg_signed_in_drop"><a style="font-weight:bold;">'+data.email+'</a></div>';
                    output += '<div class="navAccoutLinksHover upgrade_drop"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank">Upgrade to NBA LEAGUE PASS</a></div>';
                    output += '<div class="navAccoutLinksHover settings_drop"><a '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                    output += '<div class="navAccoutLinksHover sign_out_drop"><a '+defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                    break;

                    case defaults.entitleArray[0].entitlement:
                    case defaults.entitleArray[1].entitlement:
                    var output_type = navAcct.getAcctType(entitleType);
                    var output = '<div class="navAccoutLinksHover league_pass_signed_in_drop"><img src="'+imageBasePath+"@static2:elements/headerv2/lpLPUser.png@"+'" /><a style="font-weight:bold;">'+data.email+'</a><p>'+output_type+'</p></div>';
                    output += '<div class="navAccoutLinksHover settings_drop"><a ' +defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                    output += '<div class="navAccoutLinksHover sign_out_drop"><a ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                    break;
                    
                    //team
                    case defaults.entitleArray[3].entitlement:
                    var output_type = navAcct.getAcctType(entitleType);
                    var output = '<div class="navAccoutLinksHover choice_single_signed_in_drop"><a style="font-weight:bold;">'+data.email+'</a>';
                    output += '<p>'+output_type+'&nbsp;';
                    output += '<span class="team_name_drop"></span>';
                    output += '</p></div>';
                    output += '<div class="navAccoutLinksHover upgrade_drop"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank">Upgrade to NBA LEAGUE PASS</a></div>';
                    output += '<div class="navAccoutLinksHover settings_drop"><a ' +defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                    output += '<div class="navAccoutLinksHover sign_out_drop"><a ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                    break;

                    case defaults.entitleArray[2].entitlement:
                    case defaults.entitleArray[4].entitlement:
                    case defaults.entitleArray[5].entitlement:
                    var output_type = navAcct.getAcctType(entitleType);
                    var output = '<div class="navAccoutLinksHover choice_single_signed_in_drop"><a style="font-weight:bold;">'+data.email+'</a>';
                    output += '<p>'+output_type+'</p></div>';
                    output += '<div class="navAccoutLinksHover upgrade_drop"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank">Upgrade to NBA LEAGUE PASS</a></div>';
                    output += '<div class="navAccoutLinksHover settings_drop"><a ' +defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                    output += '<div class="navAccoutLinksHover sign_out_drop"><a ' +defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                    break;

                    default:
                    var output = '<div class="navAccoutLinksHover reg_signed_in_drop"><a style="font-weight:bold;">'+data.email+'</a></div>';
                    output += '<div class="navAccoutLinksHover upgrade_drop"><a href=window.membership_settings.svrPage+"/leaguepass" target="_blank">Upgrade to NBA LEAGUE PASS</a></div>';
                    output += '<div class="navAccoutLinksHover settings_drop"><a '+defaults.dataString+'='+defaults.dataStringType[2]+'>Account Details</a></div>';
                    output += '<div class="navAccoutLinksHover sign_out_drop"><a '+defaults.dataString+'='+defaults.dataStringType[0]+'>Sign Out</a></div>';
                }

                        jQuery(defaults.dropdownTarget).empty();
                        jQuery(defaults.dropdownTarget).append(output);

            },
            getAcctType: function(acctType){
            var accountName;
            switch(acctType){
                    //vip league pass
                    case 'lpbpnb':
                    case 'lpbp':
                        accountName = 'Account Type: NBA LEAGUE PASS';
                    break;
                    //team
                    case 'lpbc':
                        accountName = 'NBA TEAM PASS:';
                    break;
                    //single game
                    case 'lpsg':
                        accountName = 'Account Type: NBA SINGLE GAME';
                    break;
                    case 'lprdo':
                         accountName = 'Account: NBA LEAGUE PASS AUDIO';
                    break; 
                    case 'lpbfp':
                        accountName = 'LIMITED TIME FREE TRIAL';
                    break;
            }
            return accountName;
        },
        getTeam: function(teamID){
            var defaults = navAcct.defaults,chkSecure = navAcct.chkSecEnv(), 
            teamfeed, teams, teamRet;

                switch(chkSecure){
                    case true:
                        teamfeed = window.membership_settings.svrSecure+defaults.teamFeedSec;
                    break;
                    case false: 
                        teamfeed = defaults.teamFeed;
                    break;
                }
                switch(teamID){
                    case 0:
                        setTimeout(function(){ 
                            navAcct.setTeamName('Not Selected');
                        }, 1000);
                    break;
                    default:
                    if (w.location.hostname.indexOf(".nba.com") > -1) {
                        jQuery.ajax({
                            type: 'GET',
                            url: teamfeed,
                            dataType: 'json'
                        }).done(function(data){
                            if(chkSecure){
                               teams = data.teams;
                            }else{
                               teams = data.sports_content.teams.team; 
                            }
                                for(var i= 0; i<teams.length; i++){
                                    if(teams[i].team_abbrev === teamID){
                                        teamRet = teams[i].team_nickname;
                                    }
                                }
                          navAcct.setTeamName(teamRet);
                        });
                    }
                }
        },
        setTeamName: function(name){
            var divSpots = [];
            divSpots.push(".team_name",".team_name_resp",".team_name_drop");

            for(var i= 0; i<divSpots.length; i++){
                if(jQuery(divSpots[i]).length){
                    jQuery(divSpots[i]).text(name);
                }
            }
        },
        chkSecEnv: function(){
            var secure;
            document.URL.indexOf('secure') > -1 ? secure = true : secure = false;
            return secure;
        },
        initDropDown: function(){
            var defaults = navAcct.defaults;
                jQuery(defaults.loggedin).click(function(){
                    jQuery(defaults.dropdownTarget).css('display', 'block');
                     jQuery(defaults.dropdownTarget).hover(function(){
                           jQuery(this).css('display', 'block');
                    },function(){
                           jQuery(this).css('display', 'none');
                    });
                    return false;
                });
        },
        rankEntitlements: function(entArray){
            var defaults = navAcct.defaults, 
            returnedEnt,
            allEntitlements = defaults.entitleArray,
            matches = [];

            for(var i= 0; i<allEntitlements.length; i++){
                 for(var j= 0; j<entArray.length; j++){
                    if (allEntitlements[i].entitlement === entArray[j]){
                        matches.push({ent:allEntitlements[i].entitlement,  rank:allEntitlements[i].rank});
                    }
                }
            }
            matches.sort(function(a,b) {
               return a > b;
            });
            returnedEnt = matches[0].ent;
            return returnedEnt;
        }
    }//navAcct

    //Adding a navigation namespace.
    membership.navigation = membership.navigation || navAcct;

    //begin
    if (d.readyState && d.readyState == "complete") {
        navAcct.init();
    } else {
        w.addEventListener( "load", navAcct.init, false );
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
