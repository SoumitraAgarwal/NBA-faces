/**
 * Created by mchamblin on 5/5/16.
 */

var playersListGlobal;

(function ($, Drupal) {
  Drupal.behaviors.leaguePlayerSearch = {
    attach: function (context, settings) {


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
        jsonpCallback: 'buildPlayerListLeft',
        error:function(e){},
        success: function(response) {
          window.playersListGlobal = response;
          buildPlayerListLeft(response);
        }
      });

      function buildPlayerListLeft(data) {
        var aplhaShow = '';
        $.each(data, function(i, item) {
          if (aplhaShow !== item.orderChar) {
            var alphaHtml = ['<div id="'+ item.orderChar +'Letter" class="row letterHead" initpos="29">',
                '<div class="columns letterTitle">',
                '<span>' + item.orderChar + '</span>',
                '</div>',
                '</div>'].join('');
            $('#player-left-block').append(alphaHtml);
            aplhaShow = item.orderChar;
          }
          var allStarHtml = '';
          if (item.isAllStar === true) {
            allStarHtml = '<span class="nba-player-index__all_star" ><span class="nba-player-index__all_star_icon">All Star</span></span>';
          }
          var calHtml = ['<a class="row playerList" title=" '+ item.firstName + ' ' + item.lastName + ' " href="'+ item.playerUrl +'">',
              '<div class="player_headshot">',
              '<img class="lazyload" data-src="//ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/' + item.personId + '.png" onerror="this.onerror=null;this.src=\'//i.cdn.turner.com/nba/nba/.element/img/2.0/sect/statscube/players/large/default_nba_headshot_v2.png\';">',
              '</div>',
              '<div class="small-10 columns player-name">',
              '<span class="name-label">' + item.displayName + '</span>',
               allStarHtml,
              '<p class="player-details"><span>#' + item.jersey + '</span><span>' + item.pos +'</span><span>' + item.teamData.nickname +'</span></p>',
              '</div>',
              '<abbr title="' + item.teamData.city +'" class="columns tricode">' + item.teamData.tricode + '</abbr>',
              '</a>'].join('');

          $('#player-left-block').append(calHtml);

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

      // delay function: adds a timeout of 250 milliseconds
      // before executing the player search
      var delay = (function(){
        var timer = 0;
        return function(callback, ms){
          clearTimeout (timer);
          timer = setTimeout(callback, ms);
        };
      })();

      /*

      $( ".players-wrapper .player_headshot" ).each(function( index ) {
        var id = $(this).attr('id').replace('player-hs-id-', '');
        var headshot_html = $('.nba-player-hs-id-'+id).html();
        $(this).html(headshot_html);
      });

      */

      $('#player-search', context).keyup(function(){
        delay(function(){
          var curInput = $('#player-search').val();

          $('.players-wrapper .player-name .name-label').each(function() {
            if ($(this).text().toLowerCase().indexOf(curInput.toLowerCase()) === -1) {
              $(this).parent().parent().css('display', 'none')
            } else {
              $(this).parent().parent().css('display', 'flex')
            }
          });

          if (curInput.length > 0) {
            $('#player-list').addClass('active');
            $('#player-list').removeClass('static');
            $('.letterSearch').hide();
          } else {
            $('#player-list').removeClass('active');
            $('#player-list').addClass('static');
            $('.letterSearch').show();
          }
        }, 250 );
      });

      // Prevent Enter from reloading the page
      var playerForm = $('#player-search').parent();
      playerForm.submit(function(e){
        e.preventDefault();
      });
    }
  };
})(jQuery, Drupal);
