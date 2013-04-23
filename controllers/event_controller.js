var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var events = require('events');
var emmiter = events.EventEmitter;

var eventController = module.exports = {};

eventController.listen = function() {
	
}