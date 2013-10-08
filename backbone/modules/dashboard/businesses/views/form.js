BusinessForm = FormView.extend({
  template_path: "dashboard/businesses/templates/form",
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