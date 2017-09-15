(function ($) {
  Drupal.behaviors.leagueToggleSidebar = {
    attach: function (context, settings) {
      var $context = $(context),
          $main = $('#main');
      $context.on('click', '.nba-toggle-sidebar', function() {
        $main.toggleClass('nba-display-detail');
      });
      $context.on('click touchstart', '#block-collectionlistblock .tile.selected', function() {
        $main.addClass('nba-display-detail');
      });
    }
  };
})(jQuery);
