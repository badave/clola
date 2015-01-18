PaymentModal = Backbone.Modal.extend({
  template_path: "dashboard/payments/modals/templates/payment",
  tagName: "form",
  FIELDS: [
    [{
      "name": "address[street1]",
      "type": "text",
      "attribute": "address.street1",
      "label": "Street Address Line #1",
      "placeholder": "Street Address Line #1",
      "required": true
    },
    {
      "name": "address[street2]",
      "type": "text",
      "attribute": "address.street2",
      "label": "Street Address Line #2",
      "placeholder": "Street Address Line #2"
    },
    {
      "name": "address[city]",
      "type": "text",
      "attribute": "address.city",
      "label": "City",
      "placeholder": "City",
      "required": true
    },
    {
      "name": "address[state]",
      "type": "text",
      "attribute": "address.state",
      "label": "State",
      "placeholder": "State",
      "required": true
    },
    {
      "name": "address[zip]",
      "type": "text",
      "attribute": "address.zip",
      "label": "Zip Code",
      "placeholder": "Zip Code",
      "required": true
    }],
    [{
      "name": "card[number]",
      "type": "text",
      "attribute": "card.number",
      "label": "Credit Card Number",
      "placeholder": "4242 4242 4242 4242",
      "required": true
    },
    {
      "name": "card[exp]",
      "type": "text",
      "attribute": "card.exp",
      "label": "Expiration Date",
      "placeholder": "MM/YY",
      "required": true
    },
    {
      "name": "card[cvc]",
      "type": "text",
      "attribute": "card.cvc",
      "label": "CVC",
      "placeholder": "CVC",
      "required": true
    }
    ]
  ],
  onRender: function() {
    this.$el.find('[name="card[number]"]').payment('formatCardNumber');

    this.$el.find('[name="card[exp]"]').payment('formatCardExpiry');

    this.$el.find('[name="card[cvc]"]').payment('formatCardCVC');
  }
});

_.extend(PaymentModal.prototype, FormViewMixin, 
{
  save: function(e) {
    // TODO david change pk_test to pk_live on live envs
    Stripe.setPublishableKey(App.pk_test);
    var that = this;
    var $form = this.$el;
    var valid = $.payment.validateCardNumber($form.find('[name="card[number]"]').val());

    if ( !valid ) {
      $form.find('[name="card[number]"]').popup({
        content: "Invalid Card Number"
      });
      return false;
    }

    var bh = this.$el.find(".ok").buttonHelper("Saving", "Saved", "Failed");

    bh.loading();


    var data = Backbone.Syphon.serialize(this);

    var exp = data.card.exp;

    Stripe.createToken({
      number: data.card.number,
      cvc: data.card.cvc,
      exp_month: parseInt(exp.split('/')[0]),
      exp_year: parseInt(exp.split('/')[1]),
      address_line1: data.address.street1,
      address_line2: data.address.street2,
      address_city: data.address.city,
      address_state: data.address.state,
      address_zip: data.address.state,
      address_country: data.address.country
    }, function(status, response) {
      if(response.error) {
        that.$el.find(".ok").tooltipHelper(response.error.message);
      }

      data.stripe = response;

      that.model.save(data, {
        success: function() {
          bh.success();

          if(that.onSave) {
            that.onSave.call(that);
          }
        },
        error: function(error) {
          bh.failed();
          that.$el.find(".ok").tooltipHelper(error);
        }
      });
    });

  }
 });