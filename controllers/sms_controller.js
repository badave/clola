var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs"),
  request = require("request"),
  twilio = require("twilio");

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

smsController.test = function(req, res) {
  evt.emit("message", {"phone": "17752879549", "messages": [{"text": "sup sicko", "created": new Date().getTime()  }] });
  return helper.respondJson(req, res, 200);
}

smsController.find = function(req, res) {
	genericModel.find("messages", genericModel.jsonResponder(req, res))
}

smsController.send = function(data) {
  var client = new twilio.RestClient(config.twilio_sid, config.twilio_auth_token);

  // Pass in parameters to the REST API using an object literal notation. The
  // REST client will handle authentication and response serialzation for you.
  client.sms.messages.create({
      to:data.phone,
      from: config.twilio_number,
      body: data.message.text
  }, function(error, message) {
      
      // The HTTP request to Twilio will run asynchronously.  This callback
      // function will be called when a response is received from Twilio
      
      // The "error" variable will contain error information, if any.
      // If the request was successful, this value will be "falsy"
      if (!error) {
          
          // The second argument to the callback will contain the information
          // sent back by Twilio for the request.  In this case, it is the
          // information about the text messsage you just sent:
          console.log('Success! The SID for this SMS message is:');
          console.log(message.sid);
   
          console.log('Message sent on:');
          console.log(message.dateCreated);
      }
      else {
          console.log('Oops! There was an error.');
      }
  });
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
  msg.phone = phone;
  var phone = msg.From.replace(/\D/g, '').toString()
  var message = {
    "text": msg.Body,
    "created": new Date().getTime()
  }
  
  db.findAndModify("messages", {"phone": phone}, {}, { "$set": { "phone": phone, "status": "new" }, "$push": { "messages": message} }, { "upsert": true }, function(err, object) {
    evt.emit("message", { "phone": phone, "messages": [message] });
    db.insert("raw_messages", msg, function(err, obj) {
      helper.respondJson(req, res, 200);
    })
  })
}