FormView = Backbone.Marionette.Layout.extend({
  FIELDS: [],  
  events: {
    "submit form": "save",
    "click .save": "save",
    "click .cancel": "cancel"
  }, 
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
    var that = this;
    e.preventDefault();
    e.stopPropagation();

    var data = Backbone.Syphon.serialize(this);

    var bh = this.$el.find(".save").buttonHelper("Saving", "Saved", "Failed");

    bh.loading();

    this.model.save(data, {
      success: function() {
        bh.success();

        if(that.onSave) {
          that.onSave();
        }
      },
      error: function(error) {
        bh.failed();
        this.$el.find(".save").tooltipHelper(error);
      }
    });
  },
  cancel: function(e) {
    e.preventDefault();

    Backbone.history.navigate("/dashboard/businesses", {trigger: true});
  }
});