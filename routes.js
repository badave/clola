// Modules
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var S = require('string');

var db = require("./lib/db");
var config = require('./config');
var helper = require("./lib/helper");

// Controllers
var usersController = require('./controllers/users_controller');
var homeController = require('./controllers/home_controller');

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
