/**
 * User Model
 *
 * Last updated: 3/9/13
 */
var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs"),
  async = require('async');

var db = require("../lib/db");
var config = require("../config");
var helper = require('../lib/helper');


var User = module.exports = {};

/**
 * This creates a full User object to be stored in the DB
 * 3/1/2013
 */
User.serializeUser = function(u) {
  var user = {};
  
  // Mandatory attributes
  user._id = new ObjectID();
  user.id = user._id.toString();
  user.salt = bcrypt.genSaltSync(10);
  user.created = +new Date();
  user.created_date = new Date();
  user.secret = helper.randomHash(); // access token secret
  user.access_token = helper.encodeJwt({iss: user.id}, user.secret); // jwt access token
  // user.access_token = helper.encodeJwt({iss: user.id, nbf: +new Date(), exp: +new Date() + 604800000} , user.secret); // jwt access token

  // validate email
  if (helper.validateEmail(u.email)) {
    user.email = helper.sanitizeEmail(u.email);
  } else {
    return null;
  }

  // optional password
  if (u.password && u.password.length > 0) {
    user.hash = User.hashPassword(u.password, user.created, user.salt);
  }
  
  // console.log("Serialized User: ", user);

  return user;
}

User.setPassword = function(user, password, callback) {
  var updatedUser = {};
  updatedUser.salt = bcrypt.genSaltSync(10);
  updatedUser.secret = helper.randomHash(); // access token secret
  updatedUser.access_token = helper.encodeJwt({iss: user.id}, updatedUser.secret); // jwt access token
  updatedUser.hash = User.hashPassword(password, user.created, updatedUser.salt);
  
  var query = user.id ? {"_id": ObjectID(user.id)} : {};
  db.findAndModify("users", query, {}, {"$set": updatedUser}, {"new": true}, function(err, user) {
    return callback(err, user);
  });
}

/**
 * Boring CRUD Stuff
 */
User.find = function(query, options, callback) {
  query = query || {};
  options = options || {};
  db.find("users", query, options, function(err, users) {
    return callback(err, users);
  });
}

User.insert = function(newUser, callback) {
  db.insert("users", newUser, callback);
}

User.updateById = function(user_id, updateObject, callback) {
  // Whitelist attributes allowed to be updated
  var updatedUser = {};
  ["name", "company", "email", "bio", "stripe"].forEach(function(key) {
    if (updateObject.hasOwnProperty(key)) {
      if (key === 'email') {
        updatedUser[key] = helper.sanitizeEmail(updateObject[key]);
      } else {
        updatedUser[key] = updateObject[key];
      }
    }
  });

  // console.log(updatedUser)

  var query = user_id ? {"_id": ObjectID(user_id)} : {};
  db.findAndModify("users", query, {}, {"$set": updatedUser}, {"new": true}, function(err, user) {
    return callback(err, user);
  });
}

User.addToSetById = function(user_id, updateObject, callback) {
  var query = user_id ? {"_id": ObjectID(user_id)} : {};
  db.findAndModify("users", query, {}, {"$addToSet": updateObject}, {"new": true}, function(err, user) {
    return callback(err, user);
  });
}

User.pullById = function(user_id, updateObject, callback) {
  var query = user_id ? {"_id": ObjectID(user_id)} : {};
  db.findAndModify("users", query, {}, {"$pull": updateObject}, {"new": true}, function(err, user) {
    return callback(err, user);
  });
}

User.findOneById = function(user_id, callback) {
  db.findOne("users", {"_id": ObjectID(user_id)}, function(err, user) {
    return callback(err, user);
  });
}

User.findOneByEmail = function(email, callback) {
  db.findOne("users", {"email": email}, function(err, user) {
    return callback(err, user);
  });
}


/**
 * Helpers
 */
 
// 3/1/2013
User.verifyPassword = function(hash, password, salt, created) {
  var verifiedHash = bcrypt.hashSync(password + created.toString(), salt);
  if(verifiedHash === hash) {
    return true;
  } else {
    return false;
  }
}

// 3/1/2013
// Used internally by model
User.hashPassword = function(password, created, salt) {
  var hash = bcrypt.hashSync(password + created.toString(), salt);
  return hash;
}


// 3/1/2013
User.exists = function(query, callback) {
  db.findOne("users", query, function(err, user) {
    if (err) {
      return callback(err);
    }
    return callback(null, user ? true : false);
  });
}

User.limited = function(fullUser) {
  if (!fullUser) {
    return null;
  }

  // Whitelist attributes allowed to be updated
  var limitedUser = {};
  ["_id", "name", "company", "email", "bio"].forEach(function(key) {
    if (fullUser.hasOwnProperty(key)) {
      limitedUser[key] = fullUser[key];
    }
  });

  return limitedUser;
}



// NOT REFACTORED

User.sellingCounts = function(user_id, callback) {
  var statuses = {}

  var getCounts = function(status, callback) {
    var query = {};

    if(status !== "total") {
      query.status = status;
    }

    query.seller_id = ObjectID(user_id);
    
    db.count("orders", query, {}, function(err, count) {
      callback(err, count)
    });
  }

  // Damn, this got annoying.  Async kept crashing node for some reason
  var asyncCount = function(status) {
    return function(callback){
      getCounts(status, function(err, count) {
        callback(err, count)
      })
    }
  }

  async.parallel({
    total: asyncCount("total"),
    open: asyncCount("open"),
    paid: asyncCount("paid")
    }, 
    function(err, counts) {
      callback(err, { "selling": counts });
    })
}

User.incrementStats = function(user_id, stats, callback) {
  db.update("users", {"_id": ObjectID(user_id) }, { "$inc": stats }, {}, function(err) {
    if(err) {
      console.warn("Error incrementing stats: ", err);
    }

    return callback();
  })
}

