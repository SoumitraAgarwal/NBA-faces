/**
 * @player-tabs
 * toggle tabs of player details
 *
 */
(function ($) {
  Drupal.behaviors.leaguePlayerStats = {
    attach: function (context, settings) {
      var $context = $(context);
      $context.on('click', '.detail_profile_tabs li', function() {
        $( '.detail_profile_tabs li' ).removeClass( 'active' );
        $( '.player-tabs-content .tabs-panel' ).removeClass( 'is-active' );
        $( this ).addClass( 'active' );
        $( '#' + $( this ).data( 'tab' ) ).addClass( 'is-active' );
      });
    }
  };
})(jQuery);
