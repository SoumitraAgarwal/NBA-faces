/**
 * @sectiontabs-overlay
 * if a sectiontab has a dropdown, insert an overlay over the page
 *
 */
(function ($) {

  Drupal.behaviors.leagueToggleSectionTabOverlay = {
    attach: function (context, settings) {
      var $context = $(context);
      $( '.sectiontabs li', $context ).mouseover( function() {
        if( $( this ).find( '.overlay' ).length > 0 ) {
          $( '.sectiontabs .reveal-overlay' ).show();
        }
      }).mouseout( function() {
        if( $( this ).find( '.overlay' ).length > 0 ) {
          $( '.sectiontabs .reveal-overlay' ).hide();
        }
      });

      if( $('.sectiontabs').find( '.overlay' ).length > 0 ) {
        $('.sectiontabs li', $context).find('p a').attr('aria-label', 'Press space button or enter button or down arrow button to open the submenu.');
        $('.sectiontabs li', $context).find('p a').addClass('submenu-haschild');
        $('.sectiontabs .overlay a', $context).last().addClass('submenu-last');
      }

      $( '.sectiontabs .overlay .submenu-last').on("focusout", function (event) {
        $( '.sectiontabs .reveal-overlay' ).hide();
        $( '.sectiontabs .overlay' ).hide();
        $( '.sectiontabs .overlay' ).removeAttr('style');
      });

      $('.sectiontabs li', $context).find('p a').click(function (event) {
        if (!$('.sectiontabs #sectiontabs-cover').is(':visible')) {
          event.preventDefault();
          if ($(this).parent().parent().find('.overlay').length > 0) {
            $('.sectiontabs .reveal-overlay').show();
            $('.sectiontabs .overlay').show();
            $('.sectiontabs .overlay ul li a').first().focus();
          }
        }
      });

      $('.sectiontabs li', $context ).on("keydown", function (event) {
        if (event.which === 13 || event.which === 32 || event.which === 40) {
          if (event.target.classList.contains("submenu-haschild")) {
            event.preventDefault();
            if ($(this).find('.overlay').length > 0) {
              $('.sectiontabs .reveal-overlay').show();
              $('.sectiontabs .overlay').show();
              $('.sectiontabs .overlay ul li a').first().focus();
            }
          }
        }
        if (event.which === 27) {
          if( $( this ).find( '.overlay' ).length > 0 ) {
            $( '.sectiontabs .reveal-overlay' ).hide();
            $( '.sectiontabs .overlay' ).hide();
            $( '.sectiontabs .overlay' ).parent().find('p a').focus();
            $( '.sectiontabs .overlay' ).removeAttr('style');
          }
        }
      });


    }
  };

})(jQuery);
