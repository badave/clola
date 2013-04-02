var config = require("../config");
var eyes = require('eyes');
var _ = require("underscore");
var S = require("string");
var crypto = require('crypto');
var request = require('request');
var accounting = require('accounting');

var helper = module.exports = {};

// REFACTORED 3/20/13


/**
 * Default render responder
 */
helper.render = function(req, res, code, template, context) {
  context = context || {};
  res.status(code).render(template, context)
};

/**
 * Redirect to an Error page
 */
helper.redirectError = function(req, res) {
	res.redirect('/error');
}

/**
 * Redirect to login page and set redirect
 */

helper.redirectLogin = function(req, res, redirect) {
	if (redirect) {
		req.session.redirect = redirect;
	}
	return res.redirect('/login');
}


/**
 * Default success responder
 * data is an object
 */
helper.respondJson = function(req, res, code, data) {
  code = code || 200;
  data = data || {};

  // Detect JSONP
  var callback = req.query.callback;

  if (callback) {
    // This is a JSONP request
    var jsonp = callback + "(" + JSON.stringify(data) + ")";
    res.set({
      "Content-Type": "application/json; charset=utf-8"
    })
    res.send(code, jsonp);
  } else {
    res.json(code, data);
  }
};

/**
 * Default error responder
 * msg is a string
 *
 * 400 - Bad Request
 * 401 - Unauthorized
 * 403 - Forbidden
 * 404 - Not Found
 * 500 - Internal Server Error
 */
helper.respondJsonError = function(req, res, code, msg) {
  code = code || 500;
  if (!msg) {
    switch (code) {
      case 400:
        msg = "Bad Request";
        break;
      case 401:
        msg = "Unauthorized";
        break;
      case 403:
        msg = "Forbidden";
        break;
      case 404:
        msg = "Not Found";
        break;
      case 500:
        msg = "Internal Server Error";
        break;
      default:
        msg = "Unknown Error"
        break;
    }
  }

  var data = {"error": msg};

  // Detect JSONP
  var callback = req.query.callback;

  if (callback) {
    // This is a JSONP request
    var jsonp = callback + "(" + JSON.stringify(data) + ")";
    res.set({
      "Content-Type": "application/json; charset=utf-8"
    })
    res.send(code, jsonp);
  } else {
    res.json(code, data);
  }
}

helper.extractError = function(body) {
  if (_.isString(body)) {
    return body;
  } else if (_.isObject(body) && _.isString(body.error)) {
    return body.error;
  } else if (_.isObject(body) && _.isObject(body.error)) {
    return helper.extractError(body.error);
  } else if (_.isObject(body) && _.isString(body.message)) {
    return body.message;
  } else {
    return "Unknown Error";
  }
}

/**
 * Returns lowercase email address
 */
helper.sanitizeEmail = function(email) {
  return email.trim().toLowerCase();
}

/**
 * Validates that email address is:
 *
 * 1. a string
 * 2. length >= 0
 * 3. standard email regex
 */
helper.validateEmail = function(email) {
  if(email && typeof(email) === "string" && email.length > 0 && email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
    return true;
  } else {
    return false;
  }
}



// NOT REFACTORED YET

  
helper.respondXml = function(res, code, xml) {
  res.writeHead(code, {
    "Content-Type": "application/xml; charset=UTF-8"
  });
  if (xml) {
    res.write(xml);
  }
  res.end();
};



helper.errorMessage = function(error) {
	switch(error){
		case "connect ECONNREFUSED":
			console.warn("It appears that our API server is currently down.");
			return "It appears our API server is currently down.  Our apologies.  Please email " + config.support_email + " and we'll fix this issue ASAP.";
		case "Not found":
			return "We couldn't find what you were looking for."
		case "socket hangup":
			console.warn("Our API server just hungup on someone");
			return "Our servers decided to take a break.  We're sorry, but please try again";
		case "unknown":
			return "Sorry, but there has been an error and unfortunately, it looks like we have to fix this.  Please email " + config.support_email + " if you continue to see this error or need help with this issue.";
		default: 
			return error;
	}
}

helper.extractErrorOld = function(result, response) {
	if(!response) {
		console.warn("Major malfunction on the backend - ", result);

		if(result instanceof Error) {
			return helper.errorMessage(result.message)
		}
	} else if(result && result.error) {
		console.warn("Error loading page: ", result);

		if(result.error.message) {
			return helper.errorMessage(result.error.message);
		}
		
		return helper.errorMessage("unknown");
	} else if(response && response.statusCode >= 400) {
		if(result && result.error && result.error.message) {
			console.warn("API Result error loading page: " + response.error.message);
			return helper.errorMessage(result.error.message);
		} 

		if(response.error) {
			console.warn("Response error loading page: " + response.error);
			return helper.errorMessage(result.error);
		}

		console.warn("Nonstandard response error loading page: ", response);
		return helper.errorMessage("unknown");
	}
}

helper.errorRedirect = function(req, res, path) {
	return function(result, response) {
		var error = helper.extractError(result, response);
		if(error) {
			req.session.error = error;
			res.redirect(path);
		}
	}
}



// Objects
helper.isNull = function(obj) {
	if (!obj || obj == null || obj == "(null)") {
		return true;
	} else {
		return false;
	}
};

helper.notNull = function(obj) {
	if (!obj || obj == null || obj == "(null)") {
		return false;
	} else {
		return true;
	}
};




// Strings
helper.addslashes = function(str) {
	str=str.replace(/\\/g,'\\\\');
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\0/g,'\\0');
	return str;
}

helper.stripslashes = function(str) {
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
	str=str.replace(/\\0/g,'\0');
	str=str.replace(/\\\\/g,'\\');
	return str;
}

helper.digitsOnly = function(str) {
	return str.replace(/[^\d]/ig,'');
}

// Pass in a string representing a number
// Output will include commas
helper.addCommas = function(nStr) {
  nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
};

helper.formatCurrency = function(amountInCents) {
  return accounting.formatMoney(amountInCents / 100);
}

// helper.sanitizeBody = function(object) {
// 	var sanitizedBody = {};
// 	_.each(object, function(value, key, list) {
// 		if (typeof value === 'string') {
// 			sanitizedBody[key] = addslashes(value);
// 		} else if (typeof value === 'object') {
// 			sanitizedBody[key] = helper.sanitizeBody(value);
// 		}
// 	})
// 	return sanitizedBody;
// }


// Encrypt Decrypt
var CYPHER = 'aes256';
var CODE_ENCODING = "hex";
var DATA_ENCODING = "utf8";
var ENCRYPT_KEY = "3ef3029092d99df3d89e8af1ac29a12b8638bff0cd3e318231d97048fc2aaba4";
var VALIDATE_KEY = "a4db362ce3f39753f8e0ca1e8892e4b8524925ae5f40cb7e660397c194f99633";

function signStr(str, key) {
  var hmac = crypto.createHmac('sha1', key);
  hmac.update(str);
  return hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_');
};

function randomString(bits) {
  var rand
  , i
  , chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  , ret=''
  ;
  // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey it gives 53)
  while(bits > 0){
    rand=Math.floor(Math.random()*0x100000000); // 32-bit integer
    // base 64 means 6 bits per character,
    // so we use the top 30 bits from rand to give 30/6=5 characters.
    for(i=26; i>0 && bits>0; i-=6, bits-=6) ret+=chars[0x3F & rand >>> i]
  }
  return ret
};

var secureStringify = function(obj, encrypt_key, validate_key) {
  var nonce_check = randomString(48); // 8 chars
  var nonce_crypt = randomString(48); // 8 chars
  var cypher = crypto.createCipher(CYPHER, encrypt_key + nonce_crypt);
  var data = JSON.stringify(obj);
  var res = cypher.update(nonce_check, DATA_ENCODING, CODE_ENCODING);
  res += cypher.update(data, DATA_ENCODING, CODE_ENCODING);
  res += cypher.final(CODE_ENCODING);
  var digest = signStr(data, validate_key + nonce_check);

  // converts to base64 and replaces all = with ""
  var base64 = new Buffer(digest + nonce_crypt + res).toString("base64").replace('=', '');
  return base64;
};

var secureParse = function(str, encrypt_key, validate_key) {
  // pads base64 string to % 4 length
  while(str.length % 4 > 0) { str += "="; }
  str = new Buffer(str, "base64").toString(DATA_ENCODING);
  var expected_digest = str.substring(0, 28);
  var nonce_crypt = str.substring(28, 36);
  var encrypted_data = str.substring(36, str.length);
  var decypher = crypto.createDecipher(CYPHER, encrypt_key + nonce_crypt);
  var data = decypher.update(encrypted_data, CODE_ENCODING, DATA_ENCODING);
  data += decypher.final(DATA_ENCODING);
  var nonce_check = data.substring(0, 8);
  data = data.substring(8, data.length);
  var digest = signStr(data, validate_key + nonce_check);
  if(digest != expected_digest) throw new Error("Bad digest");
  return JSON.parse(data);
};

helper.encryptObject = function(obj, encrypt_key, validate_key) {
	if (!encrypt_key) {
		encrypt_key = ENCRYPT_KEY;
	}
	if (!validate_key) {
		validate_key = VALIDATE_KEY;
	}

	return secureStringify(obj, encrypt_key, validate_key);
}

helper.decryptObject = function(obj, encrypt_key, validate_key) {
	if (!encrypt_key) {
		encrypt_key = ENCRYPT_KEY;
	}
	if (!validate_key) {
		validate_key = VALIDATE_KEY;
	}

	return secureParse(obj, encrypt_key, validate_key);
}

/**
 * Track via Mixpanel API
 *
 */
helper.mixpanel_track = function(mixpanelOptions, callback) {
  mixpanelOptions.properties["token"] = config.mixpanel_token;
  // console.log(mixpanelOptions);

  var data = new Buffer(JSON.stringify(mixpanelOptions)).toString("base64");

  var requestOptions = {
    method: 'GET',
    json: true,
    uri: 'http://api.mixpanel.com/track',
    qs: {
      data: data
    }
  };

  request(requestOptions, function(error, response, body) {
    if (error) {
      console.warn("Request Error:", error.toString());
      return callback(error);
    } else if (response.statusCode >= 400) {
      console.warn("Request Error with code:", response.statusCode, "and message:", helper.extractError(body));
      return callback(new Error(body));
    }
    callback(null, body);
  });
}
