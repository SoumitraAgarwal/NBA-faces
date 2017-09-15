(function ($, Drupal) {
  Drupal.behaviors.activePlayerSelection = {
    attach: function (context, settings) {
      /*
       * Active Player selection
       *  Done with JS due to the Akamai Caching
       */
      var currentPath = window.location.pathname;
      $('.playerList').each(function(i, v) {
        var playerPath = $(v).attr('href');
        if (currentPath === playerPath) {
          var updatedParent = $('<div class="' + $(this).attr('class') + '">' + $(this).html() + '</div>');
          updatedParent.addClass('nba-player__list-player--active');
          $(this).replaceWith(updatedParent);
          return;
        }
      });
    }
  };
})(jQuery, Drupal);