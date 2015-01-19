LocationModal = Backbone.Modal.extend({
  template_path: "dashboard/locations/modals/location",
  tagName: "form",
  FIELDS: [
    [{
      "name": "name",
      "type": "text",
      "attribute": "name",
      "label": "Name for Location",
      "placeholder": "e.g. North SOHO, Chinatown Location, 3rd and Market",
      "required": true
    },
    {
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
      "placeholder": "Street Address Line #2",
      "required": true
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
    }]
  ]
});

_.extend(LocationModal.prototype, FormViewMixin);