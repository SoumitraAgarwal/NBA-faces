/**
 * @file
 * Provides client-side personalization interface.
 */

/* global jQuery, Modernizr */

/**
 * Define library for client-side personalization via HTML5 local storage if available, falling back to cookies.
 */

var Personalize = function () {
    // Initialization.
    var storageName = "personalize";
    var loggedIn = false;
    jQuery.cookie.json = true;

    /**
     * Public methods.
     */

    // ﻿Clear local storage.
    var reset = function () {
        saveData({});
    };

    // ﻿Find out whether a particular value is in personalization preferences.
    var check = function (category, key) {
        var data = loadData();
        return (category in data) ? data[category].includes(key) : false;
    };

    // ﻿Add value(s) in array to <category> in local storage and if logged in, to Dalton.
    var add = function (category, ids) {
        if (loggedIn) {
            var attr = {};
            for (var i = 0; i < ids.length; ++i) {
                attr[category] = ids[i];
                window._nba.dalton.updateUserAttr(attr, "add");
            }
        }
        else {
            var data = loadData();
            if (!(category in data)) {
                data[category] = [];
            }
            for (var i = 0; i < ids.length; ++i) {
                // Prevent dupes.
                if (!data[category].includes(ids[i])) {
                    data[category].push(ids[i]);
                }
            }
            saveData(data);
        }
    };

    // Retrieve category.
    var get = function (category) {
        var data = loadData();
        if (category in data) {
            return data[category];
        }
        return {};
    };

    // ﻿Remove value(s) from <category> in local storage and if logged in, from Dalton.
    var remove = function (category, ids) {
        if (loggedIn) {
            var attr = {};
            for (var i = 0; i < ids.length; ++i) {
                attr[category] = ids[i];
                window._nba.dalton.updateUserAttr(attr, "delete");
            }
        }
        else {
            var data = loadData();
            if (category in data) {
                for (var i = 0; i < ids.length; ++i) {
                    var idx = data[category].indexOf(ids[i]);
                    if (idx >= 0) {
                        data[category].splice(idx, 1);
                    }
                }
                saveData(data);
            }
        }
    };

    // ﻿Overwrite all values in a category with a new list. Possible use for this method is the personalization page.
    var replace = function (category, ids) {
        var data = loadData();
        data[category] = ids;
        saveData(data);
    };

    // Subscribe to PubSub framework.
    var enablePubSub = function() {
        // PubSub callback for dalton.success.user.isLoggedIn.
        function pubsubLoggedIn(msg, data) {
            loggedIn = true;
            window._nba.PubSub.publish('membership.get.follow.attributes');
            window._nba.PubSub.unsubscribe(loginToken);
        }
        var loginToken = window._nba.PubSub.subscribe('dalton.success.user.isLoggedIn', pubsubLoggedIn);
        window._nba.PubSub.subscribe('membership.set.success.follow', Personalize.init);
        window._nba.dalton.checkLogin();
    };

    /**
     * Private methods.
     */

    // Wrapper for load operation.
    function loadData() {
        // Use cookies.
        var data = window._nba.cookie.get(storageName);
        if (data) {
            return JSON.parse(data);
        }
        return {};
    }

    // Wrapper for save operation.
    function saveData(data) {
        // Use cookies.
        var cookieData = {
            key:storageName,
            value:window.JSON.stringify(data),
            path:'/',
            domain:'nba.com',
            ttl:8760
        };
        window._nba.cookie.set(cookieData);
    }

    // Return public methods.
    return {
        reset: reset,
        check: check,
        add: add,
        get: get,
        remove: remove,
        replace: replace,
        enablePubSub: enablePubSub
    };
}();

(function(Drupal) {
    'use strict';

    /**
     * Attach click handler to follow buttons.
     */
    Drupal.behaviors.nba_p13n = {
        attach: function (context, settings) {
            Personalize.init = function () {
                var setupFollowButton = function (button, category) {
                    var followId = button.getAttribute('data-followid');
                    button.setAttribute('data-category', category);
                    var team_player_name = button.getAttribute('data-name');

                    if (Personalize.check(category, followId)) {
                        button.classList.add("following");
                        button.innerHTML = "following";
                        button.setAttribute('aria-label', 'You are following the ' + team_player_name + ', Click to unfollow.');
                    }
                    else {
                        button.classList.remove("following");
                        button.innerHTML = "follow +";
                    }

                    button.classList.remove("invisible");
                    button.removeEventListener("click", clickCallback);
                    button.addEventListener("click", clickCallback);
                };

                // Add player follow click handler.
                var playerButtons = document.querySelectorAll('button.nba__button--follow');
                for (var i = 0; i < playerButtons.length; ++i) {
                    setupFollowButton(playerButtons[i], "players");
                }

                // Add team follow click handler.
                var teamButtons = document.querySelectorAll('button.nba-team-header__button--follow');
                for (var j = 0; j < teamButtons.length; ++j) {
                    setupFollowButton(teamButtons[j], "teams");
                }
            }

            function clickCallback(e) {
                var followId = this.getAttribute('data-followid');
                var category = this.getAttribute('data-category');
                var team_player_name = this.getAttribute('data-name');
                if (this.classList.contains('following')) {
                    this.innerHTML = "Follow +";
                    this.setAttribute('aria-label', 'Click to follow the ' + team_player_name + '.');
                    Personalize.remove(category, [followId]);
                }
                else {
                    this.innerHTML = "Following";
                    this.setAttribute('aria-label', 'You are following the ' + team_player_name + ', Click to unfollow.');
                    Personalize.add(category, [followId]);
                }
                this.classList.toggle('following')
            }

            Personalize.init();
            // Hook up PubSub callbacks.
            Personalize.enablePubSub();
        }
    };

})(Drupal);
