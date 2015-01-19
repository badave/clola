;(function($, window, document, undefined) {
  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ "tooltipHelper" ] = function(title, placement, options) {
    placement = placement || 'bottom';
    options = options || {};
    var destroy = (typeof(options.destroy) === "undefined") ? true: false;
    var destroyTimeout = options.destroyTimeout || 5000;

    var element = this;

    $(element).removeClass('input-success');
    $(element).addClass('input-error');          
    $(element).dropdown({'trigger':'manual', 'placement': placement, 'title': title });
    $(element).dropdown('show');

    if(destroy) {
      $(element).on('focus', function() {
        $(element).dropdown('destroy');
        $(element).removeClass('input-error');
      });
    }

    if($(element).prop("tagName") !== 'INPUT') {
      if(destroy) {
        setTimeout(function() {
          $(element).dropdown('destroy');
        }, destroyTimeout);
      }
    }
    return this;
  };
})(jQuery, window, document);