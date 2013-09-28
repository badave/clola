// Model
var _ = require('underscore');
var util = require('util');
var request = require('request');
var sanitize = require('validator').sanitize;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var i = require("i")();

var config = require('../lib/config');

var Amigo = require('../lib/amigo');

// Managers
var DB = require("../lib/db");

var Model = module.exports = Amigo.extend({
  className: "BaseModel",

  // A reference to the db adapter
  db: DB,

  idAttribute: "_id",
  parentIdAttribute: "parent_id",
  userIdAttribute: "user_id",
  teamIdAttribute: "team_id",

  // Database table/collection for live environment
  resource: "models",

  blacklistedFields: ["_id", "env", "created", "created_date"],
  allowedFields: ["metadata"],
  allowedConnections: [],
  requiredFields: [],
  typeofFields: {},

  defaultValues: {
    metadata: {}
  },

  /////////////////////////
  // Setters and Getters //
  /////////////////////////
  
  set: function(key, val) {
    var that = this;

    var vals = {};
    var type;
    var valid;
    var prev;

    // Accept either an object or a single key
    if (typeof key === 'object') {
      vals = key;
    } else {
      vals[key] = val;
    }

    // Convert ObjectIDs
    this.convertObjectIds(vals);

    // Sanitize Emails
    this.sanitizeEmails(vals);

    vals = _.flattenObject(vals);
    prev = _.flattenObject(_.clone(that.attributes));

    for (var k in vals) {
      valid = false;
      val = vals[k];

      // Perform type validation if the model specifies it
      type = this.typeofFields[k];
      switch (type) {
      case 'string':
        valid = _.isString(val);
        break;
      case 'email':
        valid = _.isEmail(val);
        break;
      case 'number':
        valid = _.isNumber(val);
        break;
      case 'object':
        valid = _.isObject(val) && !_.isArray(val);
        break;
      case 'array':
        valid = _.isArray(val);
        break;
      default:
        valid = true;
        break;
      }

      if (valid || _.isNull(val)) {
        if (!_.isEqual(prev[k], vals[k])) {
          _.set(this.attributes, k, val);

          that.emit('change', k);
          that.emit('change:' + k, k);
          // console.log("Set: { " + key + ": " + JSON.stringify(val) + " }");
        }
      } else {
        console.error("=== [ERROR] Invalid Set: { " + k + ": " + JSON.stringify(val) + " }");
      }
    }
  },

  env: function() {
    return this.get('env');
  },

  setEnv: function(env) {
    this.set('env', env);
  },

  id: function() {
    return this.get(this.idAttribute);
  },

  setId: function(id) {
    this.set(this.idAttribute, id);
  },

  parentId: function() {
    return this.get(this.parentIdAttribute);
  },

  setParentId: function(parentId) {
    this.set(this.parentIdAttribute, parentId);
  },

  userId: function() {
    return this.get(this.userIdAttribute);
  },

  setUserId: function(userId) {
    this.set(this.userIdAttribute, userId);
  },

  teamId: function() {
    return this.get(this.teamIdAttribute);
  },

  setTeamId: function(teamId) {
    this.set(this.teamIdAttribute, teamId);
  },

  setCreated: function() {
    this.set('created', parseInt(new Date().getTime() / 1000, 10));
    this.set('created_date', new Date());
  },

  setUpdated: function() {
    this.set('updated', parseInt(new Date().getTime() / 1000, 10));
    this.set('updated_date', new Date());
  },

  isNew: function() {
    return this.id() ? false : true;
    // return _.isEmpty(this.attributes);
  },

  exists: function() {
    return !this.isNew();
  },

  /////////////
  // Methods //
  /////////////

  initialize: function() {
    // Query/filter for fetching
    this.query = {};

    // Options
    this.options = {};

    // Connections
    this.connections = {};

    // Parent
    this.parent = null;

    // Transactions
    this.transaction = null;
    this.parentTransaction = null;
  },

  getQuery: function() {
    var that = this;
    console.log("### %s#getQuery", this.className);

    var query = {};

    // env
    if (this.env()) {
      query.env = this.env();
    }

    // _id
    if (this.id()) {
      query[this.idAttribute] = this.id();
    }

    // user_id or team_id
    if (this.userId() && this.teamId()) {
      query["$or"] = [{ "user_id": this.userId() }, { "team_id": this.teamId() }];
    } else if(this.userId()){
      query[this.userIdAttribute] = this.userId();
    }

    // parent_id
    if (this.parentId()) {
      query[this.parentIdAttribute] = this.parentId();
    }

    return _.extend(_.clone(this.query), query);
  },

  /////////////////////////
  // Lifecycle Callbacks //
  /////////////////////////

  // Sets all allowed fields not already set to null
  setDefaultValues: function() {
    console.log("### %s#setDefaultValues", this.className);
    var that = this;
    var callback = _.callback(arguments);

    _.each(this.allowedFields, function(allowedField) {
      if (_.isUndefined(that.get(allowedField)) || _.isNull(that.get(allowedField))) {
        var defaultValue = that.defaultValues[allowedField] || null;
        that.set(allowedField, _.clone(defaultValue));
      }
    });

    return callback();
  },

  // These are called before/after action events
  beforeSave: function() {
    console.log("=== Before Save on " + this.className );
    var callback = _.callback(arguments);
    return callback();
  },

  afterSave: function() {
    console.log("=== After Save on " + this.className );
    var callback = _.callback(arguments);
    return callback();
  },

  beforeFetch: function() {
    console.log("=== Before Fetch on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  afterFetch: function() {
    console.log("=== After Fetch on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  // These are called before/after database events
  beforeInsert: function() {
    console.log("=== Before Insert on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  afterInsert: function() {
    console.log("=== After Insert on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  beforeUpdate: function() {
    console.log("=== Before Update on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  afterUpdate: function() {
    console.log("=== After Update on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  beforeRemove: function() {
    var callback = _.callback(arguments);
    console.log("=== Before Remove on " + this.className);
    return callback();
  },

  afterRemove: function() {
    console.log("=== After Remove on " + this.className);
    var callback = _.callback(arguments);
    return callback();
  },

  /////////////
  // Actions //
  /////////////
  
  beginTransaction: function(callback) {
    var err;
    var that = this;

    this.transaction = {
      state: "initial",
      type: this.isNew() ? "insert" : "update",
      err: null,
      previousAttributes: _.clone(this.attributes)
    };

    return callback(err);
  },

  commitTransaction: function(callback) {
    console.log("### %s#commitTransaction", this.className);
    var err;
    var that = this;

    if (this.parentTransaction && this.parentTransaction.state !== "pending") {
      return callback();
    }

    this.transaction.state = "pending";

    // First process all transactions from connections
    var fns = [];
    _.each(this.connections, function(connection) {
      if (connection.transaction && connection.parentTransaction) {
        connection.transaction.state = "pending";
        fns.push(connection.commitTransaction.bind(connection));
      }
    });

    if (this.transaction.type === "insert") {
      fns.push(this.insert.bind(this));
    } else if (this.transaction.type === "update") {
      fns.push(this.update.bind(this));
    }

    async.series(fns, function(err) {
      if (err) {
        that.transaction.err = err;
        return that.rollbackTransaction(callback);
      }

      that.transaction.state = "done";

      return callback();
    });
  },

  rollbackTransaction: function(callback) {
    console.log("### %s#rollbackTransaction", this.className);
    var err;
    var that = this;

    if (this.parentTransaction && this.parentTransaction.state !== "fail") {
      return callback();
    }

    this.transaction.state = "fail";

    // First process all transactions from connections
    var fns = [];
    _.each(this.connections, function(connection) {
      if (connection.transaction && connection.parentTransaction) {
        connection.transaction.state = "fail";
        fns.push(connection.rollbackTransaction.bind(connection));
      }
    });

    if (this.transaction.type === "insert") {
      // Just remove the record
      console.log(this.transaction);
      fns.push(this.remove.bind(this));
    } else if (this.transaction.type === "update") {
      // Restore previous attributes
      this.set(this.transaction.previousAttributes);
      fns.push(this.update.bind(this));
    }

    async.series(fns, function(err) {
      if (err) {
        return callback(err);
      }

      return callback(that.transaction.err);
    });
  },

  fetch: function() {
    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var callback = _.callback(arguments);

    // Custom Query?
    if (args.length > 1) {
      this.query = args[0];
    }

    // Perform FindOne
    var fns = [];
    fns.push(this.beforeFetch.bind(this));
    fns.push(this.findOne.bind(this));
    fns.push(this.afterFetch.bind(this));

    async.series(fns, function(err, results) {
      return callback(err);
    });
  },

  save: function() {
    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var callback = _.callback(arguments);

    // Custom Query
    if (args.length > 1) {
      this.query = args[0];
    }

    // Perform Insert or Update
    var fns = [];

    var isInsert = this.isNew();

    // fns.push(this.beginTransaction.bind(this));

    fns.push(this.setDefaultValues.bind(this));
    fns.push(this.beforeSave.bind(this));
    if (isInsert) {
      fns.push(this.beforeInsert.bind(this));
      fns.push(this.insert.bind(this));
      fns.push(this.saveConnections.bind(this));
      fns.push(this.loadConnections.bind(this));
      fns.push(this.afterInsert.bind(this));
    } else {
      fns.push(this.beforeUpdate.bind(this));
      fns.push(this.update.bind(this));
      fns.push(this.saveConnections.bind(this));
      fns.push(this.loadConnections.bind(this));
      fns.push(this.afterUpdate.bind(this));
    }
    fns.push(this.afterSave.bind(this));

    async.series(fns, callback);
  },

  destroy: function() {
    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var callback = _.callback(arguments);

    // Custom Query
    if (args.length > 1) {
      this.query = args[0];
    }

    // Perform Remove
    var fns = [];
    fns.push(this.beforeRemove.bind(this));
    fns.push(this.remove.bind(this));
    fns.push(this.afterRemove.bind(this));

    async.series(fns, function(err, results) {
      return callback(err);
    });
  },

  saveConnections: function() {
    console.log("### %s#saveConnections", this.className); 

    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var callback = _.callback(arguments);

    var fns = [];

    if (this.connections) {
      _.each(this.connections, function(connection) {
        connection.user = that.user;
        connection.setEnv(that.env());
        connection.setParentId(that.id());
        connection.setUserId(that.userId());
        connection.setTeamId(that.teamId());

        fns.push(connection.save.bind(connection));
      });
    }

    async.series(fns, callback);
  },

  loadConnections: function() {
    console.log("### %s#loadConnections", this.className); 

    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var callback = _.callback(arguments);

    if (this.connections) {
      _.each(this.connections, function(connection, property) {
        that.set(property, connection.toObject());
      });
    }

    return callback();

  },

  /////////////////////////
  // Database Operations //
  /////////////////////////
  
  findOne: function() {
    console.log("=== FindOne on " + this.className + " with Query: " + JSON.stringify(this.getQuery()) );

    var that = this;
    var callback = _.callback(arguments);

    this.db.findOne(this.resource, this.getQuery(), function(err, object) {
      if (!err && !object) {
        err = new Error("Model for Resource: '" + that.resource  + "'' Not Found");
        err.code = 404;
        console.error("=== [WARNING] Model for Resource: '%s' Not Found. Query: %s", that.resource, JSON.stringify(that.getQuery()));
      } else if (!err) {
        that.set(object);
      }

      return callback(err);
    });
  },

  insert: function() {
    console.log("=== Insert on " + this.className );

    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var callback = _.callback(arguments);

    this.setId(new ObjectID());
    this.setCreated();
    this.setUpdated();

    this.db.insert(this.resource, this.attributes, callback);
  },

  // This is actually using findAndModify, NOT update
  update: function() {
    console.log("=== Update on " + this.className + " with Query: " + JSON.stringify(this.getQuery()) );

    var that = this;
    var callback = _.callback(arguments);

    // Default MongoDB Adapter Options
    var mongoOptions = {"new": true};
    if (this.options["new"]) {
      mongoOptions["new"] = this.options["new"];
    }
    if (this.options["upsert"]) {
      mongoOptions["upsert"] = this.options["upsert"];
    }
    if (this.options["remove"]) {
      mongoOptions["remove"] = this.options["remove"];
    }

    // Timestamps
    this.set('updated', parseInt(new Date().getTime() / 1000, 10));
    this.set('updated_date', new Date());

    // Strip
    var attrs = this.toSafeObject();

    this.db.findAndModify(this.resource, this.getQuery(), {}, {"$set": attrs}, mongoOptions, function(err, object) {
      if (!err && !object) {
        err = new Error("Model for Resource: '" + that.resource  + "'' Not Found");
        err.code = 404;
        console.error("=== [WARNING] Model for Resource: '%s' Not Found. Query: %s", that.resource, JSON.stringify(that.getQuery()));
      } else if (!err) {
        that.set(object);
      }

      return callback(err);
    });
  },

  remove: function() {
    console.log("=== Remove on " + this.className + " with Query: " + JSON.stringify(this.getQuery()) );

    var err;
    var that = this;
    var callback = _.callback(arguments);

    var query = this.getQuery();
    if (this.isNew()) {
      err = new Error("Attempting to remove a nonexistent model.");
      code = 500;
      return callback(err);
    }

    that.db.remove(this.resource, query, function(err, removed) {
      return callback(err);
    });
  },

  /////////////
  // Helpers //
  /////////////
  
  toObject: function() {
    var obj = _.clone(this.attributes);
    obj = _.omit(obj, ["env", "parent_id"]);
    return obj;
  },

  toSafeObject: function() {
    var obj = this.toObject();
    obj = _.omit(obj, ["_id", "user_id", "team_id", "env", "created", "created_date"]);
    return obj;
  },

  // Traverses an object and converts all keys that match the regexp /_id/ into ObjectID if applicable
  convertObjectIds: function(obj) {
    var that = this;

    _.each(obj, function(val, key) {
      if (/_id/.test(key) && _.isValidObjectID(val)) {
        obj[key] = ObjectID(val);
      } else if (_.isObject(val) || _.isArray(val)) {
        that.convertObjectIds(val);
      } else {
        return;
      }
    });
  },

  sanitizeEmails: function(obj) {
    var that = this;

    _.each(obj, function(val, key) {
      if (/email/.test(key)) {
        obj[key] = val ? val.trim().toLowerCase() : null;
      } else if (_.isObject(val) || _.isArray(val)) {
        that.sanitizeEmails(val);
      } else {
        return;
      }
    });
  },

  /**
   * To use validate, add validating function as property to validators and have it return an error if an error exists
   * 
   * validators: {
   *   key: function() {
   *   var err = new Error("I am errored");
   *   return err; // is invalid
   *   },
   */
  validate: function() {
    var err;

    if(!this.validators || _.isEmpty(this.validators)) {
      return;
    }

    for(var key in this.validators) {
      var validator = this.validators[key];
      err = validator.apply(this, arguments);
      if(err) {
        break;
      }
    }

    return err;
  },

  // This is a helper that is called recursively
  // UNUSED
  cleanXSS: function(obj) {
    var that = this;

    for (var key in obj) {
      if (key === '_bsontype') continue;
      if (!obj.hasOwnProperty(key)) continue;
      if (_.isObject(obj[key]) && obj[key].hasOwnProperty('_bsontype')) continue; // ObjectID

      if (_.isString(obj[key])) {
        // String
        obj[key] = sanitize(obj[key]).xss();
      } else if (_.isArray(obj[key])) {
        // Array
        that.cleanXSS(obj[key]); // recursive call
      } else if (_.isObject(obj[key])) {
        // Object
        that.cleanXSS(obj[key]); // recursive call
      } else {
        // Ignore BOOL, Number
        continue;
      }
    }
  }
});
