// MongoDB
var mongodb = require('mongodb');

// https://github.com/mongodb/node-mongodb-native

var db = module.exports = {};

// Connects to MongoDB – Attempts to reuse a connection if it is active
db.connect = function(callback) {
	if (db.client === null || db.client === undefined) {
		console.log("Connecting to MongoDB with URL: " + db.url);

	  mongodb.connect(db.url, {db: {native_parser: true, auto_reconnect: true}}, function(err, client) {
	  	db.client = client;
      callback(err, db.client);
	  });
	} else {
		callback(null, db.client);
	}
};

// Workaround
// https://github.com/jcottr/temps-mort
db.connectPrimaryAndClose = function(callback) {
	console.log("Connecting to MongoDB Primary and Close with URL: " + db.primary_url);

  mongodb.connect(db.url, {db: {native_parser: true, auto_reconnect: true}}, function(err, client) {
  	if (!err && client) {
			client.close();
  	}
  	callback(err)
  });
};

// Get next sequence for counter
db.getNextSequence = function(collection, key, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
			client.collection(collection, function(err, collection) {
				if (err) {
					callback(err, null);
				} else {
					collection.findAndModify({key: key}, {}, {"$inc": {seq: 1}}, {new: true}, function(err, object) {
						if (err) {
							callback(err, null);
						} else {
							callback(err, object.seq);
						}
					});
				}
			});
		}
	});
};

// Erases all records from a collection, if any
db.eraseCollection = function(collection, query, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
			client.collection(collection, function(err, collection) {
				if (err) {
					callback(err, null);
				} else {
	        collection.remove({}, {safe:true}, function(err, object) {
	        	if (err) {
			        callback(err, null);
			      } else {
	          	callback(err, object);
	          }
	        });
				}
			});
		}
	});
};

// Remove a document
db.remove = function(collection, query, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
	      if (err) {
	        callback(err, null);
	      } else {
	        collection.remove(query, {safe:true}, function(err, object) {
	        	if (err) {
			        callback(err, null);
			      } else {
	          	callback(err, object);
	          }
	        });
	      }
	    });
		}
	});
};

db.count = function(collection, query, options, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
	      if (err) {
	        callback(err, null);
	      } else {
	        collection.find(query, options).count(function(err, count) {
	        	if (err) {
			        callback(err, null);
			      } else {
	          	callback(err, count);
	          }
	        });
	      }
	    });
		}
	});
};

// Find all objects matching query
db.find = function(collection, query, options, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
	      if (err) {
	        callback(err, null);
	      } else {
	        collection.find(query, options).toArray(function(err, objects) {
	        	if (err) {
			        callback(err, null);
			      } else {
	          	callback(err, objects);
	          }
		      });
	      }
	    });
		}
	});
};

// Find a single object matching query
db.findOne = function(collection, query, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
		    if (err) {
	        callback(err, null);
	      } else {
	        collection.findOne(query, function(err, object) {
	        	if (err) {
			        callback(err, null);
			      } else {
	          	callback(err, object);
	          }
	        });
	      }
	    });
		}
	});
};

// Insert a document (safe: true)
db.insert = function(collection, obj, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
	      if (err) {
	        callback(err, null);
	      } else {
	        collection.insert(obj, {safe:true}, function(err, objects) {
	        	if (err) {
	        		callback(err, null);
	        	} else {
	        		if (objects.length === 1) {
	         			callback(err, objects[0]);
	         		} else {
	         			callback(err, objects)
	         		}
	        	}
	        });
	      }
	    });
		}
	});
};

// Update one or more objects
db.update = function(collection, query, obj, options, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
	      if (err) {
	        callback(err, null);
	      } else {
	        collection.update(query, obj, options, function(err) {
	          callback(err);
	        });
		    }
	    });
		}
	});
};

// Update and return one object
db.findAndModify = function(collection, query, sort, update, options, callback) {
	db.connect(function(err, client) {
		if (err) {
			callback(err, null);
		} else {
	    client.collection(collection, function(err, collection) {
	      if (err) {
	        callback(err, null);
	      } else {
	        collection.findAndModify(query, sort, update, options, function(err, object) {
	        	if (err) {
			        callback(err, null);
			      } else {
	          	callback(err, object);
	          }
	        });
	      }
	    });
		}
	});
};