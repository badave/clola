var ObjectID = require('mongodb').ObjectID,
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  hbs = require("hbs");

var db = require("../lib/db");
var helper = require('../lib/helper');
var config = require("../config");

var User = require("../models/user");

var usersController = module.exports = {};


var setUserCookie = function(res, user, rememberMe) {
  var cookieOptions = {};
  if (rememberMe === true) {
    cookieOptions['maxAge'] = 1209600000;
  }
  cookieOptions['secure'] = !config.test;
  cookieOptions['httpOnly'] = true;
  cookieOptions['signed'] = true;
  res.cookie("access_token", user.access_token, cookieOptions);
}

usersController.logout = function(req, res) {
  res.cookie("access_token", "");
  res.redirect("/go");
}

/**
 * This route is internal only
 * 3/9/13
 */
usersController.find = function(req, res, next) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  // This endpoint is Admin ONLY
  if (!req.user.admin) {
    console.log(req.user);
    return helper.respondJsonError(req, res, 401);
  }

  User.find({}, {}, function(err, users) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    return helper.respondJson(req, res, 200, {"users": users});
  });
};


/**
 * Responds with a user
 * If this user is same as authenticated user, return sensitive keys
 * 
 * 3/9/13
 */
usersController.findOne = function(req, res) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  var user_id = req.params.user_id;
  var showFullUser = false; // show private info

  // No user specified
  if(!user_id) {
    return helper.respondJsonError(req, res, 400, "No user specified");
  }

  // Me/Self authenticated request
  if (user_id === 'me' || user_id === 'self') {
    user_id = req.user.id;
    showFullUser = true;
  } else if (user_id !== req.user.id) {
    return helper.respondJsonError(req, res, 403);
  }

  // Find user in DB
  User.findOneById(user_id, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    user = showFullUser ? user : User.limited(user)
    return helper.respondJson(req, res, 200, {"user": user});
  });
}


/**
 * Updates a user
 *
 * Expects Content-Type: application/json
 * 
 * Checks to make sure email address is unique in DB
 * Does NOT perform any additional validation, the caller is responsible
 * 3/9/13
 */
usersController.update = function(req, res, next) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  if (!req.is('json')) {
    return helper.respondJsonError(req, res, 400, "Content-Type must be set to application/json");
  }

  var user_id = req.params.user_id;
  var updatedUser = req.body.user;

  // Restrict to authenticated users only
  if(!user_id || !updatedUser) {
    return helper.respondJsonError(req, res, 400);
  }

  // Me/Self authenticated request
  if (user_id === 'me' || user_id === 'self') {
    user_id = req.user.id;
  } else if (user_id !== req.user.id) {
    return helper.respondJsonError(req, res, 403);
  }

  // This function updates the user in the DB
  var finishUpdate = function(updatedUser) {
    User.updateById(user_id, updatedUser, function(err, user) {
      if (err) {
        return helper.respondJsonError(req, res, 500, err.toString());
      }

      return helper.respondJson(req, res, 200, {"user": user});
    });
  };

  // Check to make sure no one else is using this email already
  if (updatedUser.email) {
    // Trim and lowercase
    var email = helper.sanitizeEmail(updatedUser.email);

    User.findOneByEmail(email, function(err, user) {
      if (err) {
        return helper.respondJsonError(req, res, 500, err.toString());
      }

      // Prevent hijacking of email
      if (user && (req.user.email !== user.email)) {
        return helper.respondJsonError(req, res, 400, "A user already exists with the email address " + req.body.user.email);
      }

      finishUpdate(updatedUser);
    });
  } else {
    finishUpdate(updatedUser);
  }
}

/**
 * Register a new user
 *
 * Expects Content-Type: application/json
 *
 * Email required
 * Password optional
 *
 * 3/11/13
 */
usersController.create = function(req, res, next) {
  var userData = req.body;

  if (!userData.email) {
    return helper.respondJsonError(req, res, 400);
  }

  // if (!req.is('json')) {
  //   return helper.respondJsonError(req, res, 400, "Content-Type must be set to application/json");
  // }

  // Trim and lowercase
  var email = helper.sanitizeEmail(userData.email);

  // First check for an existing user with this email
  User.exists({email: email}, function(err, userExists) {
    if (err || userExists) {
      if(req.is("json")) {
        return helper.respondJsonError(req, res, 500, err.toString());
      } else {
        req.session.error = "A user with that email already exists.";
        return res.redirect("/go");
      }
    }

    var newUser = User.serializeUser(userData);

    // Create the user
    User.insert(newUser, function(err, user) {
      if(req.is('json')) {
        if (err) {
          return helper.respondJsonError(req, res, 500, err.toString());
        }
        setUserCookie(res, user, true);
        return helper.respondJson(req, res, 201, {"user": user});
      } else {
        if(err) {
          return res.redirect("/go");
        } else {
          setUserCookie(res, user, true);
          res.redirect("/dashboard");
        }
      }
    });
  });
};

/**
 * Attempts to authenticate (login) a user by verifying email/password
 * 
 * 3/1/2013
 */
usersController.authenticate = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if(!email || !password) {
    return helper.respondJsonError(req, res, 400, "Missing email or password");
  }

  // Trim and lowercase
  email = helper.sanitizeEmail(email);

  User.findOneByEmail(email, function(err, user) {
    if (err || !user) {
      if(!user) {
        req.session.error = "User doesn't exist";
      }

      if(req.is("json")) {
        return helper.respondJsonError(req, res, 500, err.toString());
      } else {
        return res.redirect("/go");
      }
    }

    // Validate password
    if (User.verifyPassword(user.hash, password, user.salt, user.created)) {
      setUserCookie(res, user, true);
      if(req.is('json')) {
        return helper.respondJson(req, res, 200, {"user": user});
      } else {
        res.redirect("/dashboard");
      }
    } else {
      if(req.is('json')) {
        return helper.respondJsonError(req, res, 403, "Invalid password for user with email: " + user.email);
      } else { 
        res.redirect("/go");
      }
    }


  });
};


/**
 * Lookup a User by Email and return public information
 */

// This is being used for checkout
usersController.findOneByEmail = function(req, res) {
  var email = req.query.email;

  // No user specified
  if (!email || email === '') {
    return helper.respondJsonError(req, res, 400, "No email specified");
  }

  // Trim and lowercase
  email = helper.sanitizeEmail(email);

  // Find user in DB
  User.findOneByEmail(email, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    return helper.respondJson(req, res, 200, {"user": User.limited(user)});
  });
}

/**
 * Forgot password
 *
 * Generates a reset token
 *
 * 3/11/13
 */
usersController.forgotPassword = function(req, res, next) {
  var email = req.body.email;

  if (!email || email === '') {
    return helper.respondJsonError(req, res, 400, "No email specified");
  }

  // Trim and lowercase
  email = helper.sanitizeEmail(email);

  User.findOneByEmail(email, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    if (!user) {
      return helper.respondJsonError(req, res, 404, "User not found with email: " + email);
    }

    // Generate secret reset link using our client_id expiring after 7 days in ms
    var resetToken = helper.encodeJwt({iss: user.id, exp: +new Date() + 604800000}, config.client_id);

    return helper.respondJson(req, res, 200, {"reset_token": resetToken});
  });
}

/**
 * Reset password
 *
 * Sets a new password
 *
 * 3/11/13
 */
usersController.setPassword = function(req, res, next) {
  var reset_token = req.body.reset_token;
  var password = req.body.password;

  if (!reset_token) {
    return helper.respondJsonError(req, res, 400, "No reset token");
  }

  var payload = helper.decodeJwt(reset_token, config.client_id);
  if (!payload || !payload.iss || payload.exp < Date.now()) {
    return helper.respondJsonError(req, res, 400, "Invalid or expired reset token");
  }

  User.findOneById(payload.iss, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    if (!user) {
      return helper.respondJsonError(req, res, 404, "User not found with id: " + payload.iss);
    }

    User.setPassword(user, password, function(err, user) {
      if (err) {
        return helper.respondJsonError(req, res, 500, err.toString());
      }

      return helper.respondJson(req, res, 200, {"user": user});
    });
  });
}


/**
 * Finds all stripe customers belonging to a user
 * 3/13/13
 */
usersController.findCustomer = function(req, res, next) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  var user_id = req.params.user_id;

  // No user specified
  if(!user_id) {
    return helper.respondJsonError(req, res, 400, "No user specified");
  }

  // Me/Self authenticated request
  if (user_id === 'me' || user_id === 'self') {
    user_id = req.user.id;
  } else if (user_id !== req.user.id) {
    return helper.respondJsonError(req, res, 403);
  }

  // Find user in DB
  User.findOneById(user_id, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    var customers = user.customers || [];
    return helper.respondJson(req, res, 200, {"customers": customers});
  });
}

/**
 * Adds a stripe customer to a user
 * 3/13/13
 */
usersController.addCustomer = function(req, res, next) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  var user_id = req.params.user_id;

  // No user specified
  if(!user_id) {
    return helper.respondJsonError(req, res, 400, "No user specified");
  }

  // Me/Self authenticated request
  if (user_id === 'me' || user_id === 'self') {
    user_id = req.user.id;
  } else if (user_id !== req.user.id) {
    return helper.respondJsonError(req, res, 403);
  }

  var customer = req.body.customer;

  var updateObject = {
    "customers": customer
  }

  User.addToSetById(user_id, updateObject, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    var customers = user.customers || [];
    return helper.respondJson(req, res, 200, {"customers": customers});
  });
}


/**
 * Find the Stripe merchant info
 * 3/14/13
 */
usersController.findStripe = function(req, res, next) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  var user_id = req.params.user_id;

  // No user specified
  if(!user_id) {
    return helper.respondJsonError(req, res, 400, "No user specified");
  }

  // Me/Self authenticated request
  if (user_id === 'me' || user_id === 'self') {
    user_id = req.user.id;
  } else if (user_id !== req.user.id) {
    return helper.respondJsonError(req, res, 403);
  }

  // Find user in DB
  User.findOneById(user_id, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    var stripe = user.stripe || {};
    return helper.respondJson(req, res, 200, {"stripe": stripe});
  });
}

/**
 * This route is used by the Stripe merchant connect
 *
 * Expects Content-Type: application/json
 * 
 * 3/11/13
 */
usersController.updateStripe = function(req, res, next) {
  if(!req.user) {
    return helper.respondJsonError(req, res, 401);
  }

  var user_id = req.params.user_id;

  // No user specified
  if(!user_id) {
    return helper.respondJsonError(req, res, 400, "No user specified");
  }

  // Me/Self authenticated request
  if (user_id === 'me' || user_id === 'self') {
    user_id = req.user.id;
  } else if (user_id !== req.user.id) {
    return helper.respondJsonError(req, res, 403);
  }

  var stripe = req.body.stripe;

  if (!stripe) {
    return helper.respondJsonError(req, res, 400);
  }

  var updateObject = {
    stripe: stripe
  };

  User.updateById(user_id, updateObject, function(err, user) {
    if (err) {
      return helper.respondJsonError(req, res, 500, err.toString());
    }

    var stripe = user.stripe || {};
    return helper.respondJson(req, res, 200, {"stripe": stripe});
  });
};

// Not implemented - 3/14/13
usersController.deleteStripe = function(req, res, next) {
  return helper.respondJsonError(req, res, 501);
}

// NOT REFACTORED


usersController.counts = function(req, res, next) {
  if(!req.user) {
    return helper.respondError(res, 400, "Requires a valid access token");
  }

  var user_id = req.user.id;

  User.sellingCounts(user_id, function(err, counts) {
    if(err) {
      return helper.respondError(res, 500, err);
    }

    return helper.respondSuccess(res, 200, counts);
  })
}



