/*JS for new NBA global navigation */
(function($) {

  $(function() {
    var module = {},
      waitForFinalEvent,
      site_url = '';

    if ((window.location.hostname).indexOf('beta.nba.com') > -1 ||
      (window.location.hostname).indexOf('local.nba.com') > -1) {
      site_url = '';
    } else {
      site_url = 'http://www.nba.com';
    }

    function setListeners() {
      $(document).on('click', '.nba-primary-nav .nba-nav__container--button', toggleMenu);
      $(document).on('click', '.nba-secondary-nav__list--item--dropdown > a', showSubNav);
      $(window).on('resize', function() {
        // Announce the new orientation number
        waitForFinalEvent(module.checkNav, 500, 'navitems');
      });
      $(document).on('click', '.nba-secondary-nav__list--item-more, .nba-secondary-nav__list--item-back', toggleSSRightNav);
      $(window).scroll(module.stickySidebar);
      $('img.lazyload').on('load', function() { window.Foundation.reInit('equalizer'); });
    }

    function cookieCallback(msg, data) {
      if ( msg === "dalton.success.cookie.updated" ) {
        renderAccountMenu(data);
      }
    }

    function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length,c.length);
        }
      }
      return "";
    }

    /*
     * Nav will be used outside of NBA.com, so we have to verify
     * these variables do indeed exist.
     */
    if (window._nba &&
      window._nba.hasOwnProperty('membership') &&
      window._nba.membership.isLoggedIn()) {
      window._nba.PubSub.subscribe('dalton.success.cookie.updated', cookieCallback);
      window._nba.PubSub.subscribe('membership.unauthorized.sso.check', cookieCallback);
      window._nba.PubSub.subscribe('membership.authorized.sso.check', cookieCallback);
    }
    else {
      renderAccountMenu();
    }

    function getAccessMenuItems(data) {
      var items = [];
      var qs = '?nbaMembershipRedirectExternalUrl=' + encodeURIComponent(window.location.href);
      var itemUpgrade = { text: 'Buy NBA LEAGUE PASS', href: site_url + '/leaguepass'};
      // Not Logged In.
      if (data && data.entitlements) {

        items.push({ text: data.email, href: site_url + '/membership/user/settings' + qs });
        /* items.push({ text: data.email, href: '#' });
         */

        $('.nba-nav__account-item').addClass('logged-in');

        var entitlements = data.entitlements.reduce(function(result, prop){
          result[prop] = true;
          return result;
        }, {});

        // NBA LEAGUE PASS aka access to all teams (lpbp) & VIP (lpbpnb).
        if (entitlements.lpbp || entitlements.lpbpnb) {
          $('.nba-nav__account').addClass('nba-nav__account-vip');
        }
        // Team Pass (lpbc) - Audio League Pass (lprdo).
        else if (entitlements.lpbc || entitlements.lprdo || entitlements.lpsg) {
          $('.nba-nav__account').addClass('nba-nav__account-lp');
        }

        // General NBA Account, NBA Single Game, AND Free Trial for NBA League Pass.
        else {
          // removing for off-season
          // items.push(itemUpgrade);
        }
        items.push({ text: 'Account Details', href: site_url + '/membership/user/settings' + qs});
        items.push({ text: 'Help', href: '//leaguepasssupport.nba.com'});
        items.push({ text: 'Sign Out', href: site_url + '/membership/user/logout' + qs});
      }
      // Not Logged In.
      else {
        items.push({ text: 'Sign In', href: site_url + '/membership/user/login' + qs});
        items.push({ text: 'Create Account', href: site_url + '/membership/user/register'});
        items.push({ text: 'Help', href: '//leaguepasssupport.nba.com'});
      }

      // All Users.
      return items;
    }

    function renderAccountMenu(data) {

      if ( !$('.nba-nav__account-item').hasClass('nba-nav__account-loaded') ) {

        var items = getAccessMenuItems(data);
        items = items.map(function (d) {
          return $('<li>').append($('<a>').text(d.text).attr('href', d.href));
        });
        if (!data || data.errors) {
          var memberCookie = decodeURIComponent(getCookie('nbaMembershipInfo'));
          try {
            memberCookie = JSON.parse(memberCookie);
          } catch (e) {
            memberCookie = {};
          }
          if (memberCookie && memberCookie.email) {
            items = [
              $('<li>').append($('<span>').text(memberCookie.email)),
              $('<li>').append($('<a>').text('Account Details').attr('href', 'http://www.nba.com/membership/user/settings?nbaMembershipRedirectExternalUrl=' + encodeURIComponent(window.location))),
              $('<li>').append($('<a>').text('Sign Out').attr('href', 'http://www.nba.com/membership/user/logout?nbaMembershipRedirectExternalUrl=' + encodeURIComponent(window.location))),
              $('<li>').append($('<a>').text('Help').attr('href', 'http://leaguepasssupport.nba.com/'))
            ];
          }
          function isLeaguePass(element, index, array) {
            return ['lpbp', 'lpbpnb', 'lpbc', 'lprdo'].indexOf(element) >= 0;
          }

          if (memberCookie.entitlements && memberCookie.entitlements.some(isLeaguePass)) {
            $('a.nba-nav__lp').attr('href', '/games');
          }
        }
        $('.nba-nav__account-item').addClass('nba-nav__account-loaded');
        $('.nba-nav__account').siblings('.nba-nav__submenu').append(items);

        var f = $('.nba-nav').find('scoreboard-score-toggle').parent().detach();

        $('.nba-nav__account').siblings('.nba-nav__submenu').children().last().after(f);
      }
    };

    waitForFinalEvent = (function () {

      var timers = {};

      return function (callback, ms, uniqueId) {

        if (!uniqueId) {
          uniqueId = 'Don\'t call this twice without a uniqueId';
        }

        if (timers[uniqueId]) {
          clearTimeout (timers[uniqueId]);
        }

        timers[uniqueId] = setTimeout(callback, ms);
      };
    }());

    function showSubNav(event) {
      var $navLink = $(this),
        $wrapperLI = $navLink.parents('li:first'),
        $subNav = $wrapperLI.find('ul:first');

      $wrapperLI.toggleClass('nba-secondary-nav__list--item--dropdown--open');
      event.preventDefault();

      if ($subNav.is(':visible')) {
        $navLink.attr('aria-expanded', 'false');
        $subNav.hide(500);
      } else {
        $navLink.attr('aria-expanded', 'true');
        $subNav.show({duration:500, step: function(n, t){
          var liRects = $wrapperLI[0].getBoundingClientRect();
          var containerHeight = $('.nba-secondary-nav__container').height();
          if (liRects.bottom > containerHeight) {
            // To account for desktop and mobile. The element that scrolls is different.
            // We can get away with trying to assign both element as only one will scroll.
            // Note we do not have any mobile sniffing available here.
            var currScroll = $('.nba-secondary-nav__ss--right-slide').scrollTop() === 0 ?
              $('.nba-secondary-nav__container').scrollTop() : $('.nba-secondary-nav__ss--right-slide').scrollTop();
            var newScroll = currScroll + liRects.bottom - containerHeight;
            $('.nba-secondary-nav__ss--right-slide').scrollTop(newScroll);
            $('.nba-secondary-nav__container').scrollTop(newScroll);
          }
        }});
      }

      return false
    }

    function toggleSSRightNav(event) {
      var $leftNav = $('.nba-secondary-nav__wrapper'),
        $bothButtons = $('.nba-secondary-nav__list--item-more, .nba-secondary-nav__list--item-back'),
        $button = $(this);

      $bothButtons.each(function() {
        $(this).attr('aria-pressed', 'false');
      });

      if ($button.attr('aria-pressed') === 'false') {
        $button.attr('aria-pressed', 'true');
      } else {
        $button.attr('aria-pressed', 'false');
      }

      $leftNav.toggleClass('nba-secondary-nav__container--ss-slide-left');
    }

    function renderMenuIcons() {
      $('.nba-nav-wrapper li[data-menu-icon]').each(function() {
        var menu_icon = $(this).attr('data-menu-icon');
        $(this).find('a').prepend($('<img>').attr('src', menu_icon));
      });
    }

    function toggleMenu(event) {
      var $button = $(this),
        $secondaryNav = $('.nba-secondary-nav__container');

      $secondaryNav.toggleClass('nba-secondary-nav__container--open');
      $button.toggleClass('nba-nav-container__button--open');
    }

    function pinMenuLink(path) {
      var $accordionNav = $('.nba-secondary-nav__list--middle'),
        $secondaryNav = $('.nba-secondary-nav__list--top'),
        $menuLink = '';
      if ($accordionNav.find('li a[href="/' + path + '"]').length) {
        $menuLink = $accordionNav.find('li a[href="/' + path + '"]');
        if ($secondaryNav.find('li a[href="/' + path + '"]').length) {
          $secondaryNav.find('li a[href="/' + path + '"]').parent().remove();
        }
        $secondaryNav.prepend($menuLink.parent().clone().show());
        $menuLink.parent().hide();
      }
    }

    /**
     * Hightlight the selected tab in main menu.
     */
    function highlightMainMenu() {
      var currentPath = window.location.pathname;
      var currentPathFragment = currentPath.split('/');
      var $mainMenu = $('.nba-nav__container--center-menu');
      var $mainMenuItem = $('.nba-nav__container--center-menu li');
      var deepLinks = ["/games"];
      $mainMenuItem.each(function(index, element) {
        var $currentElement = $(element);
        var itemPath = $currentElement.find('a').attr('href');
        if (currentPathFragment.length < 3) {
          if (currentPath === itemPath) {
            $currentElement.addClass('active');
            return false;
          }
        } else if (deepLinks.indexOf(itemPath) !== -1 && '/' + currentPathFragment[1] === itemPath) {
          $currentElement.addClass('active');
          return false;
        }
      });
    }

    module.checkNav = function() {
      // First remove extra NBA LEAGUE PASS link on secondary nav if present.
      $('.nba-secondary-nav__container a[href="/leaguepass"]').closest('.nba-secondary-nav__list--item').remove();

      var $navItems = $('.nba-primary-nav .nba-nav__container--center-menu li'),
        $secondaryNav = $('.nba-secondary-nav__list--top'),
        $primaryRightNav = $('.nba-nav__container--right-add-to-secondary'),
        $firstElement;

      $navItems.each(function(index, element) {
        var $currentElement = $(element),
          currentPosition = $currentElement.position(),
          firstElementPosition;

        if (index === 0) {
          $firstElement = $currentElement;
        }
        var $currentElementClasses = $currentElement.attr("class").split(' nba-nav__container--center-menu-item');
        if (!$firstElement.is(':visible')) {
          if (!$secondaryNav.find('a[href="' + $currentElement.find('a:first').attr('href') + '"]').length) {
            $secondaryNav.append('<li class="nba-secondary-nav__list--item ' + $currentElementClasses[0] + '"><a href="' + $currentElement.find('a:first').attr('href') + '">' + $currentElement.find('a:first').html() + '</a></li>');
          }
        } else {
          firstElementPosition = $firstElement.position();

          if (firstElementPosition.top !== currentPosition.top) {
            if (!$secondaryNav.find('a[href="' + $currentElement.find('a:first').attr('href') + '"]').length) {
              $secondaryNav.append('<li class="nba-secondary-nav__list--item ' + $currentElementClasses[0] + '"><a href="' + $currentElement.find('a:first').attr('href') + '">' + $currentElement.find('a:first').html() + '</a></li>');
            }
          } else {
            $secondaryNav.find('a[href="' + $currentElement.find('a:first').attr('href') + '"]').parents('li:first').remove();
          }
        }

      });

      $primaryRightNav.find('.nba-nav__container--right-item').each(function(index, element) {
        var $element = $(element).find('a'),
          $item = $(element).clone(),
          href = $element.attr('href');
        if ($item.hasClass('nba-nav__store-item')) {
          $secondaryNav.find('.nba-nav__store-item').remove();
          $item.addClass('nba-secondary-nav__list--item--dropdown');
        }
        if (!$element.is(':visible')) {
          if (!$secondaryNav.find('a[href="' + href + '"]').length) {
            $item.addClass('nba-secondary-nav__list--item nba-secondary-nav__list--item-highlight');
            $secondaryNav.prepend($item);
          }
        }
        else {
          $secondaryNav.find('a[href="' + href + '"]').parents('li:first').remove();
        }
      });

      highlightMainMenu();
    };

    module.stickySidebar = function() {
      /* Pin sidebar below nav when global ad scrolls out of view. */
      if (!$('#main').hasClass('nba-no-sidebar')) {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var $globalAd = $('.nba-ad-container.global-nav');
        if ($globalAd && scrolled >= $globalAd.outerHeight() &&
          $('#content').outerHeight() > $('#main_sidebar').outerHeight()) {
          var nav = document.getElementsByClassName('nba-primary-nav')[0];
         var belowNav = nav.offsetTop + nav.offsetHeight;
          $('#main_sidebar').css('top', belowNav);
          $('body').addClass('sticky-sidebar');
        }
        else {
          $('body').removeClass('sticky-sidebar');
        }
      }
    };

    module.start = function() {
      setListeners();
      module.checkNav();
      renderMenuIcons();
    };

    $(module.start);

  });
})(jQuery);
