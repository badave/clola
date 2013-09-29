_.extend(_, {

  numberToPercentage:function (result, options) {
    if (isNaN(result)) {
      result = 0;
    }

    result = result * 100.0;

    if (options.precision != undefined) {
      result = result.toFixed(options.precision);
    }

    return result + '%';
  },

  numberWithPrecision:function (num) {
    var options = arguments[1];
    var delimeter = options ? options.delimiter : ",";
    var parts = num.toString().split(".");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, delimeter);
    return parts.join(".");
  },

  toTitleCase:function (string) {
    return string.replace(/(?:^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
  },

  sortAsc:function (array) {
    return array.sort(function (a, b) {
      return a - b;
    });
  },

  sortDesc:function (array) {
    return array.sort(function (a, b) {
      return b - a;
    });
  },

  arraysEqual:function (a1, a2) {
    if (a1.length !== a1.length)
      return false;
    for (var i = a1.length; i--;) {
      if (a1[i] != a2[i])
        return false;
    }
    return true;
  },

  flattenObject: function(obj) {
    var ret = {},
        separator = ".";

    if(_.isArray(obj)) {
      ret = [];
    }

    for (var key in obj) {
      if(!_.isNaN(Number(key))) {
        key = Number(key);
      }
      var val = obj[key];

      if(!_.isEmpty(val) && _.isArray(val)) {
        //Recursion for embedded objects
        var obj2 = _.flattenObject(val);

        ret[key] = obj2;
      } else if (!_.isEmpty(val) && _.get(val, "constructor") === Object) {
        //Recursion for embedded objects
        var obj2 = _.flattenObject(val);

        for (var key2 in obj2) {
          var val2 = obj2[key2];

          ret[key + separator + key2] = val2;
        }
      } else {
        ret[key] = val;
      }
    }

    return ret;
  },

  get: function(object, string, defaultReturnObj) { 
    if(_.isEmpty(object) || _.isEmpty(string)) {
      return defaultReturnObj;
    }

    if(!_.isString(string)) {
      string = string.toString();
    }

    string = string.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
    string = string.replace(/^\./, ''); // strip leading dot

    var keys = string.split('.');
    var key;

    if(_.isFunction(object.get)) {
      // the objects getter should not use it's own get
      object = object.get(key, defaultReturnObj);
    } else { 
      while (keys.length > 0) {
        key = keys.shift();

        if(_.isFunction(object.get)) {
          object = object.get(key);
        } else if(_.has(object, key)) {
          object = object[key];
        } else {
          return defaultReturnObj;
        }
      }
    }

    return object;
  },

  set: function(object, string, value) {
    if(_.isUndefined(object)) {
      object = {};
    }

    if(!_.isString(string)) {
      // try anyway
      string = string.toString();
    }

    string = string.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
    string = string.replace(/^\./, ''); // strip leading dot

    var keys = string.split('.');
    var key, val, ptr;

    if(_.isFunction(object.set)) {
      object.set(string, value);
    } else {
      ptr = object;
      while (keys.length > 0) {
        // Pop first key
        key = keys.shift();

        // This is much cleaner for arrays
        if(!_.isNaN(Number(key))) {
          key = Number(key);
        }

        if (keys.length === 0) {
          // If no more keys left, this is the final key
          ptr[key] = value;
        } else if(ptr[key] && _.isFunction(ptr[key].set)) {
          nextKey = keys.shift();
          ptr[key].set(nextKey, value);
        } else if (ptr[key] && _.isObject(ptr[key])) {
          // Found an object or array at key, keep digging
          ptr = ptr[key];
        } else if(!ptr[key] || !_.isObject(ptr[key])) {
          // undefined or not an object, create an object to have prop
          if(!_.isNaN(Number(key))) {
            ptr[key] = [];
          } else {
            ptr[key] = {};
          }
          ptr = ptr[key];
        } else {
          break;
        }
      }
    }
  }
});
