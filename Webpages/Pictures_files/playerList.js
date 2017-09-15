(function ($, Drupal) {
  Drupal.behaviors.leaguePlayerList = {
    attach: function (context, settings) {

      var win = $(window);
      var ajaxContentLoaded = false;

      // Each time the user scrolls
      win.scroll(function() {

        if (ajaxContentLoaded === false && $(document).height() - win.height() === (win.scrollTop())) {

          if (typeof window.playersListGlobal !== 'undefined') {
            var skip = 60;
            buildPlayerListContent(window.playersListGlobal, skip);
          } else {

            var sdata_url_base = getParameterByName('SDATA_URL_BASE');
            var sdata_url_path = getParameterByName('SDATA_URL_PATH');
            var query_string = '';
            if (sdata_url_base !== '') {
              query_string = '?SDATA_URL_BASE='+ sdata_url_base;
            }
            if (sdata_url_path !== '') {
              if (query_string === '') {
                query_string += '?';
              }
              else {
                query_string += '&';
              }
              query_string += 'SDATA_URL_PATH='+ sdata_url_path;
            }

            $.ajax({
              url: '/players/active_players.json' + query_string,
              type: 'GET',
              cache: true,
              dataType: 'json',
              data: {
                start: 60
              },
              jsonpCallback: 'buildPlayerListContent',
              error: function (e) {
              },
              success: function (response) {
                buildPlayerListContent(response);
              }
            });
          }

        }
      });

      function buildPlayerListContent(data, skip) {
        ajaxContentLoaded = true;
        skip = skip || 0;
        var iteration = 0;
        $.each(data, function(i, item) {
          if (skip !== 0 && iteration < skip) {
            iteration++;
            return;
          }
          var allStarHtml = '',
              allStarClass = '';
          if (item.isAllStar === true) {
            allStarClass = ' allstar-background';
            allStarHtml = '<span class="nba-player-index__all_star"><span title="All Star" class="nba-player-index__all_star_icon"></span></span>';
          }
          var teamHtmlClass = ' team-' + item.teamData.tricode + '-' + item.teamData.urlName;
          teamHtmlClass = teamHtmlClass.toLowerCase();
          var calHtml = ['<section class="nba-player-index__trending-item small-4 medium-3 large-2 ' + teamHtmlClass + '">',
              '<span class="nba-player-trending-item__number">' + item.jersey +'</span>',
              '<a title="'+ item.firstName + ' ' + item.lastName + '" href="'+ item.playerUrl +'">',
              '<div class="nba-player-index__image_wrapper">',
              '<div class="nba-player-index__image"><div class="nba-player-index__headshot_wrapper' + allStarClass + '" ><img class="lazyload" data-src="//ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+ item.personId +'.png" onerror="this.onerror=null;this.src=\'//i.cdn.turner.com/nba/nba/.element/img/2.0/sect/statscube/players/large/default_nba_headshot_v2.png\';" /></div></div>',
              allStarHtml,
              '</div>',
              '<p class="nba-player-index__name">' + item.firstName + '<br>' + item.lastName + '</p>',
              '<div class="nba-player-index__details">',
              '<span>' + item.posExpanded +'</span>',
              '<span><strong>' + item.heightFeet + '</strong> ft <strong>' + item.heightInches + '</strong> in | <strong>' + item.weightPounds + '</strong> lbs</span>',
              '</div>',
              '</a>',
              '<a class="nba-player-index__team-image" href="/teams/' + item.teamData.urlName + '/"><img alt="' + item.urlName + '" src="//i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/' + item.teamData.tricode + '.svg"></a>',
              '</section>'].join('');

          $('.row.nba-player-index__row').append(calHtml);
          iteration++;
        });
      }

      function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return '';
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }


    }


  };
})(jQuery, Drupal);
