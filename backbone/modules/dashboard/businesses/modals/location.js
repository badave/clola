LocationModal = Backbone.Modal.extend({
  template_path: "dashboard/businesses/modals/templates/location",
  FIELDS: [
    {
      "name": "name",
      "type": "text",
      "attribute": "name",
      "label": "Name of Location: "
    },
    {
      "name": "address[street1]",
      "type": "text",
      "attribute": "address.street1",
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
  ]
});

_.extend(LocationModal.prototype, FormViewMixin);