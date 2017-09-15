/**
 * @headshotFallback
 * Headshot Fallback
 *
 */
(function ($) {
  Drupal.behaviors.headshotFallback = {
    attach: function (context, settings) {
      var fallback = '//i.cdn.turner.com/nba/nba/.element/img/2.0' +
        '/sect/statscube/players/large/default_nba_headshot_v2.png',
        missingHeadshots = [];

      $('.nba-player-header__headshot img')
        .each(function() {
          // Stop potential infinite loop in the event fallback 404's o_O
          if (this.src !== fallback) {
            /*
             * If we already know the player headshot is missing
             * we can add the fallback automatically on other instances
             */
            if (missingHeadshots.indexOf(this.src) !== -1) {
              $(this).attr('src', fallback);
            } else {
              /*
               * Check if the player image needs to fallback
               */
              $(this).error(function() {
                missingHeadshots.push(this.src);
                $(this).attr('src', fallback);
              }).attr('src', this.src);
            }
          }
        });
    }
  };
})(jQuery);
