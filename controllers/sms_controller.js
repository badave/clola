var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var url = require('url');

var evt = require("../models/evt");

var smsController = module.exports = {};
var genericModel = require("../lib/generic_model");

smsController.index = function(req, res) {
	var context = {
	  title: config.title
	}
	return helper.render(req, res, 200, 'sms/index', context);
}

smsController.find = function(req, res) {
	genericModel.find("messages", genericModel.jsonResponder(req, res))
}

/**
 * Example request
 * 2013-04-22T08:29:27.208017+00:00 app[web.1]:   Body: 'Ping',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   ToZip: '',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   FromState: 'NV',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   ToCity: '',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   SmsSid: 'SM0a07a18ae477b79e755bd552cdf84531',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   ToState: 'FL',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   To: '+19414445652',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   ToCountry: 'US',
2013-04-22T08:29:27.208017+00:00 app[web.1]:   FromCountry: 'US',
2013-04-22T08:29:27.208328+00:00 app[web.1]:   SmsMessageSid: 'SM0a07a18ae477b79e755bd552cdf84531',
2013-04-22T08:29:27.208328+00:00 app[web.1]:   ApiVersion: '2010-04-01',
2013-04-22T08:29:27.208328+00:00 app[web.1]:   FromCity: 'RENO',
2013-04-22T08:29:27.208328+00:00 app[web.1]:   SmsStatus: 'received',
2013-04-22T08:29:27.208328+00:00 app[web.1]:   From: '+17752879549'
 */
smsController.post = function(req, res, next) {
  var context = {
    title: config.title
  }

  var msg = req.body;
  console.log(msg);

  evt.emit("new_message", msg);

  db.insert("messages", msg, function(err, object) {
  	helper.respondJson(req, res, 200)
  })
}