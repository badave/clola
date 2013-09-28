var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var genericModel = require("../lib/generic_model");

var vendorsController = module.exports = {};

vendorsController.find = function(req, res, next) {
  genericModel.findWithQuery("vendors", { "user_id": req.user._id }, genericModel.jsonResponder(req, res))
}

vendorsController.create = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }

  var vendor = req.body;

  vendor.user_id = req.user._id;
  vendor.created = new Date().getTime();
  vendor.created_date = new Date();
  
  genericModel.create("vendors", req.body, genericModel.jsonResponder(req, res));
}

vendorsController.update = function(req, res) {
  if(!req.user) {
    return res.redirect("/go");
  }
  
  genericModel.update("vendors", { "_id": ObjectID(req.params.id), "user_id": req.user._id }, req.body, genericModel.jsonResponder(req, res));
}