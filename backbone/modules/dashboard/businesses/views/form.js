BusinessForm = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/businesses/templates/form",
  events: {
    "submit form": "save",
    "click .save": "save"
  }, 
  FIELDS: [
    {
      "name": "name",
      "type": "text",
      "attribute": "name",
      "label": "Name of Business: "
    },
    {
      "name": "email",
      "type": "text",
      "attribute": "email",
      "label": "Email: "
    },
    {
      "name": "url",
      "type": "url",
      "attribute": "url",
      "label": "URL: "
    },
    {
      "name": "image_url",
      "type": "url",
      "attribute": "image_url",
      "label": "Image URL: "
    },
    {
      "name": "address[street1]",
      "type": "text",
      "attribute": "address.street",
      "label": "Street: "
    },
    {
      "name": "address[street2]",
      "type": "text",
      "attribute": "address.street2",
      "label": "Street #2: "
    },
    {
      "name": "address[city]",
      "type": "text",
      "attribute": "address.city",
      "label": "City: "
    },
    {
      "name": "address[state]",
      "type": "text",
      "attribute": "address.state",
      "label": "State: "
    },
    {
      "name": "address[zip]",
      "type": "text",
      "attribute": "address.zip",
      "label": "Zip Code: "
    }
  ],
  context: function(modelJson) {
    _.each(this.FIELDS, function(field, index) {
      field.idx = field.attribute.toString() + "-" +  index.toString();
      field.value = _.get(modelJson, field.attribute, "");
    });

    return {
      model: modelJson,
      fields: this.FIELDS
    };
  },
  save: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var data = Backbone.Syphon.serialize(this);

    var bh = this.$el.find(".save").buttonHelper("Saving", "Saved", "Failed");

    bh.loading();

    this.model.save(data, {
      success: function() {
        bh.success();
        // Backbone.history.navigate("/dashboard/businesses", {trigger: true});
      },
      error: function(error) {
        bh.failed();
        this.$el.find(".save").tooltipHelper(error);
      }
    });
  }
});