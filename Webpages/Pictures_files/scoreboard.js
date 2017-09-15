(function($) {
  Drupal.behaviors.scoreTiles = {
    activate: function (scoreTile) {
      $('.score-tile').removeClass('score-tile-selected');
      $('.score-tile', scoreTile).addClass('score-tile-selected');
    }
  };
})(jQuery);
