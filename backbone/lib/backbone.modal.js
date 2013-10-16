/**
 * Semantic UI Modal wrapper for use with Backbone.
 * 
 * Takes care of instantiation, manages multiple modals,
 * adds several options and removes the element from the DOM when closed
 *
 * @author David Badley
 *
 * Events:
 * shown: Fired when the modal has finished animating in
 * hidden: Fired when the modal has finished animating out
 * cancel: The user dismissed the modal
 * ok: The user clicked OK
 */
(function($, _, Backbone) {
  var Modal = Backbone.Marionette.ItemView.extend({
    className: 'ui modal',
    events: {
      'click .btn-cancel': function(event) {
        this.trigger('cancel');
      },
      'click .cancel': function(event) {
        this.trigger('cancel');
      },
      'click .ok': function(event) {
        this.trigger('ok');

        if(this.okClicked) {
          this.okClicked(event);
        }
      }
    },
    allowCancel: true,
    /**
     * Creates an instance of a Bootstrap Modal
     *
     * @see http://twitter.github.com/bootstrap/javascript.html#modals
     *
     * @param {Object} options
     * @param {String|View} [options.content] Modal content. Default: none
     * @param {String} [options.title]        Title. Default: none
     * @param {String} [options.okText]       Text for the OK button. Default: 'OK'
     * @param {String} [options.cancelText]   Text for the cancel button. Default: 'Cancel'. If passed a falsey value, the button will be removed
     * @param {Boolean} [options.allowCancel  Whether the modal can be closed, other than by pressing OK. Default: true
     * @param {Boolean} [options.escape]      Whether the 'esc' key can dismiss the modal. Default: true, but false if options.cancellable is true
     * @param {Boolean} [options.animate]     Whether to animate in/out. Default: false
     * @param {Function} [options.template]   Compiled underscore template to override the default one
     */
    // initialize: function(options) {
    //   this.options = _.extend({
    //     title: null,
    //     okText: 'OK',
    //     focusOk: true,
    //     okCloses: true,
    //     cancelText: 'Cancel',
    //     allowCancel: true,
    //     escape: true,
    //     animate: false
    //   }, options);
    // },

    /**
     * Renders and shows the modal
     *
     * @param {Function} [cb]     Optional callback that runs only when OK is pressed.
     */
    open: function(cb) {
      if (!this.isRendered) this.render();

      var self = this,
          $el = this.$el;

      //Create it
      $el.modal()
        .modal('setting', 'closable', false)
        .modal('setting', 'transition', 'scale')
        .modal("setting", "onShow", function() {
          if (self.options.focusOk) {
            $el.find('.btn.ok').focus();
          }

          self.trigger('shown');
        })
        .modal('show');

      this.on('cancel', function() {
        self.close();
      });

      Modal.count++;

      //Run callback on OK if provided
      if (cb) {
        self.on('ok', cb);
      }
      
      return this;
    },

    /**
     * Closes the modal
     */
    close: function() {
      var self = this,
          $el = this.$el;

      //Check if the modal should stay open
      if (this._preventClose) {
        this._preventClose = false;
        return;
      }

      $el.modal("setting", "onCancel", function() {
        self.remove();
        self.trigger('hidden');
      }).modal("hide");

      Modal.count--;
    },

    /**
     * Stop the modal from closing.
     * Can be called from within a 'close' or 'ok' event listener.
     */
    preventClose: function() {
      this._preventClose = true;
    }
  }, {
    //STATICS

    //The number of modals on display
    count: 0
  });


  //EXPORTS
  //CommonJS
  if (typeof require == 'function' && typeof module !== 'undefined' && exports) {
    module.exports = Modal;
  }

  //AMD / RequireJS
  if (typeof define === 'function' && define.amd) {
    return define(function() {
      Backbone.Modal = Modal;
    })
  }

  //Regular; add to Backbone.Bootstrap.Modal
  else {
    Backbone.Modal = Modal;
  }

})(jQuery, _, Backbone);