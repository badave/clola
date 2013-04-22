var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var smsController = module.exports = {};

smsController.post = function(req, res, next) {
	console.log(req.body);
  var context = {
    title: config.title
  }
  res.send("");
}