// Modules
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var S = require('string');

var db = require("./lib/db");
var config = require('./config');
var helper = require("./lib/helper");

// controllers
var usersController = require('./controllers/users_controller');
var customersController = require('./controllers/customers_controller');
var homeController = require('./controllers/home_controller');
var smsController = require('./controllers/sms_controller');
var placesController = require('./controllers/places_controller');
var businessesController = require('./controllers/businesses_controller');
var locationsController = require('./controllers/locations_controller');
var vendorsController = require('./controllers/vendors_controller');
// String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};

// Routes
module.exports = function(app) {
  // CORS Options requests
  app.options('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.send(200);
  });

  // Root
  app.get("/", homeController.index);
  app.get("/app", homeController.awesomeSauce);
  app.get("/go", homeController.go);
  app.get("/dashboard*", homeController.dashboard);

  // app.get("/users", usersController.index);
  app.post("/register", usersController.create);
  app.post("/login", usersController.authenticate);
  app.get("/logout", usersController.logout);

  app.get("/v1/customers", customersController.find);
  app.get("/v1/customers/:phone", customersController.findByNumber);
  app.post("/v1/customers/:phone", customersController.create);
  app.put("/v1/customers/:phone", customersController.update);

  app.get("/v1/places", placesController.find);
  app.post("/v1/places", placesController.create);
  app.put("/v1/places/:id", placesController.update);

  app.get("/v1/vendors", vendorsController.find);
  app.post("/v1/vendors", vendorsController.create);
  app.put("/v1/vendors/:id", vendorsController.update);

  app.get("/v1/locations", locationsController.find);
  app.get("/v1/locations/:id", locationsController.findOne);
  app.post("/v1/locations", locationsController.create);
  app.put("/v1/locations/:id", locationsController.update);

  app.get("/v1/businesses/:business_id/locations", locationsController.findByBusinessId);
  app.get("/v1/businesses/:business_id/locations/:location_id", locationsController.findOneByBusinessId);
  app.post("/v1/businesses/:business_id/locations", locationsController.createByBusinessId);
  app.put("/v1/businesses/:business_id/locations/:location_id", locationsController.updateByBusinessId);

  app.get("/v1/businesses", businessesController.find);
  app.get("/v1/businesses/:id", businessesController.findOne);
  app.post("/v1/businesses", businessesController.create);
  app.put("/v1/businesses/:id", businessesController.update);

  app.get("/sms/test", smsController.test);
  app.post("/sms", smsController.post);
  app.get("/v1/messages", smsController.find);
  app.get("/v1/messages/:phone", smsController.findByNumber);



  ///////////////////////////////
  // These are INTERNAL routes //
  ///////////////////////////////

  /////////////////////////////
  // These are PUBLIC routes //
  /////////////////////////////
  

  /**
   * Products
   */
  /**
   * Users
   */

  /**
   * Stripe
   */
  
  
}
