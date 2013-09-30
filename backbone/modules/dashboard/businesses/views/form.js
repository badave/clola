BusinessForm = Backbone.Marionette.Layout.extend({
  template_path: "dashboard/businesses/templates/form",
  FIELDS: [
    {
      "name": "name",
      "type": "text",
      "attribute": "name",
      "label": "Name of Business: "
    },
    {
      "name": "address[street1]",
      "type": "text",
      "attribute": "address.street",
      "label": "Company Street: "
    },
    {
      "name": "address[street2]",
      "type": "text",
      "attribute": "address.street2",
      "label": "Company Street #2: "
    },
    {
      "name": "address[zip]",
      "type": "text",
      "attribute": "address.zip",
      "label": "Company Zip Code: "
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
  }
});