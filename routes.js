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
// String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};

// Routes
module.exports = function(app) {
  // CORS Options requests
  app.options('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.send(200);
  })

  // Root
  app.get("/", homeController.index);

  app.get("/users", usersController.index)

  app.get("/customers", customersController.index)
  app.get("/v1/customers/:phone", customersController.findByNumber);
  app.post("/v1/customers/:phone", customersController.create);
  app.put("/v1/customers/:phone", customersController.update);

  app.get("/places", placesController.index);

  app.get("/v1/places", placesController.find);

  app.post("/v1/places", placesController.create);


  app.post("/sms", smsController.post);
  app.get("/sms", smsController.index);
  app.get("/sms/test", smsController.test);
  app.get("/v1/messages", smsController.find);



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
