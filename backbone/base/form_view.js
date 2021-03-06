FormViewMixin = {
  events: {
    "submit form": "save",
    "click .ok": "save",
    "click .cancel": "cancel"
  }, 
  context: function(modelJson) {
    _.each(this.FIELDS || [], function(fields, index) {
      if(_.isArray(fields)) {
        _.each(fields, function(field) {
          field.idx = field.attribute.toString() + "-" +  index.toString();
          field.value = _.get(modelJson, field.attribute, "");
        });
      } else {
        var field = fields;
        field.idx = field.attribute.toString() + "-" +  index.toString();
        field.value = _.get(modelJson, field.attribute, "");
      }
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

    var bh = this.$el.find(".ok").buttonHelper("Saving", "Saved", "Failed");

    bh.loading();

    this.model.save(data, {
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
  },
  cancel: function(e) {
    e.preventDefault();

    if(this.onCancel) {
      this.onCancel();
    }
  }
};

FormView = Backbone.Marionette.Layout.extend({});

_.extend(FormView.prototype, FormViewMixin);