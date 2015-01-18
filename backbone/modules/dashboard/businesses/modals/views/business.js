BusinessModal = Backbone.Modal.extend({
  template_path: "dashboard/businesses/modals/templates/business",
  tagName: "form",
  FIELDS: [
    [{
      "name": "name",
      "type": "text",
      "attribute": "name",
      "label": "Business Name",
      "placeholder": "Business Name",
      "required": true
    },
    {
      "name": "email",
      "type": "text",
      "attribute": "email",
      "label": "Contact Email",
      "placeholder": "Contact Email",
      "required": true
    },
    {
      "name": "contact_name",
      "type": "text",
      "attribute": "contact_name",
      "label": "Contact Name",
      "placeholder": "Contact Name",
      "required": true
    },

    {
      "name": "contact",
      "type": "tel",
      "attribute": "phone",
      "label": "Contact Phone",
      "placeholder": "Contact Phone",
      "required": true
    },
    {
      "name": "url",
      "type": "url",
      "attribute": "url",
      "label": "URL",
      "placeholder": "https://"
    },
    {
      "name": "image_url",
      "type": "url",
      "attribute": "image_url",
      "label": "Image URL",
      "placeholder": "https://"
    }],
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
    }]
  ]
});


_.extend(BusinessModal.prototype, FormViewMixin);