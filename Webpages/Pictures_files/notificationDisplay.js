(function ($, Drupal) {
  var width = $(window).width();
  Drupal.behaviors.notificationDisplay = {
    attach: function (context, settings) {
      var pageWidth = $('body', context).width();
      var notifications = $('#nba-notifications', context);
      var notificationsContent = $('.notifications-items a', context).text();
      var removeButton = $('.notifications-close', notifications);
      var height = $(notifications).outerHeight();

      $(notifications).width(pageWidth);

      if (sessionStorage.getItem('notificationsContent') !== notificationsContent) {
        sessionStorage.setItem('notificationsContent', notificationsContent);
        sessionStorage.setItem('notificationsDisabled', 'false');
      }

      if (sessionStorage.getItem('notificationsDisabled') !== 'true') {
        $(notifications).css({"display": "block"});
        removeButton.on('click', function(event){
          event.preventDefault();
          $(notifications).css({"transform": "translateY("+(height)+"px)", 'opacity': 0}).delay(1000).hide(0);
          sessionStorage.setItem('notificationsDisabled', 'true');
        });
      }
    }
  };

  window.addEventListener("resize", function() {
    if($(this).width() !== width){
      width = $(this).width();
      var pageWidth = $('body').width();
      var notifications = $('#nba-notifications');
      $(notifications).width(pageWidth);
    }
  }, false);

})(jQuery, Drupal);
