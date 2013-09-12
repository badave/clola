// These are some helpers that make developing a bit easier
/*
	Marionette automatically passes in modelJson to context.  When overriding context, you can
	specify more items to pass to the template without having to redeclare the render or template function
 */
Backbone.Marionette.ItemView.prototype.context = Backbone.Marionette.CompositeView.prototype.context = function(modelJson) {
	return {
		model: modelJson
	};
};

/*
	This initializer makes it easier to simply pass in whatever you need for a view to have.

	For example:

	var itemView = new ItemView({
		model: model,
		onSelect: select
	});

	model will be accessible by itemView.model and onSelect will also be accessable from itemView.onSelect

	It also automatically binds this to template so you don't have to do it later.  This is a reuqirement if using
	the template function below.

	You can now specify whether or not you want a view to automatically render when updated
 */
Backbone.Marionette.ItemView.prototype.initialize = Backbone.Marionette.CompositeView.prototype.initialize =function(options) {
	var that = this;
	// Autoextends
	_.extend(this, options);
	this.options = options;
	_.bindAll(this, "template", "onCreate", "onCreateCancel", "onSave", "onCancel");

	if(this.autoupdate) { 
		if(this.model) {
			this.model.on("change", function() { that.render(); });
		}

		if(this.collection) {
			this.collection.on("change", function() { that.render(); });
		}
	}
};

/*
	There was a lot of repetitive code here where we were writing template = Handlebars.templates["blah/blah"]; etc
	This by default will take whatever is specified by template_path and help render it dependent upon context

	Please use context if you can and avoid overriding this.
 */
Backbone.Marionette.ItemView.prototype.template = Backbone.Marionette.CompositeView.prototype.template =  function(modelJson) {
	if(!this.template_path) { throw new Error("Add a template path to your view.  If you're getting this error and you have a template_path, your initializer needs _.bindAll(this, 'template'); in it, or override template"); }
	var template = Handlebars.templates[this.template_path];

	if(typeof(this.context) === "function") {
		return template(this.context(modelJson));
	} else if(typeof(this.context) === "object") {
		return template(this.context);
	}
		
	return template();
};

/*
	Automatically passes model and collection into itemViewOptions

	itemViewOptions doesn't exist in vanilla backbone though it really should
 */
Backbone.Marionette.Layout.prototype.itemViewOptions = function() {
	var options = {};
	var that = this;

	_.each(["collection", "model", "onSelect", "onAdd", "onSave", "onCancel", "onCreate", "onCreateCancel"], function(prop) {
		if(that[prop]) {
			options[prop] = that[prop];
		}
	});

	return options;
};

// Empty
Backbone.Marionette.ItemView.prototype.onCreate = Backbone.Marionette.ItemView.prototype.onCreateCancel = Backbone.Marionette.ItemView.prototype.onSave = Backbone.Marionette.ItemView.prototype.onCancel = function() {};

/*
	Loop through specified regionViews and show them
 */
Backbone.Marionette.Layout.prototype._createRegionViews = function() {
	if(this.regionViews) {

		var regionViews = this.regionViews;

		if(_.isFunction(this.regionViews)) {
			regionViews = this.regionViews();
		}

		var that = this;

		_.each(regionViews, function(View, region) {

			var viewOptions = that.itemViewOptions;

			if(_.isFunction(that.itemViewOptions)) {
				viewOptions = that.itemViewOptions();
			}

			that[region].show(new View(viewOptions));

		});
	}
};

/*
	Modified Layout.render for regionViews
 */
Backbone.Marionette.Layout.prototype.render = function() {
	if (this._firstRender){
		// if this is the first render, don't do anything to
		// reset the regions
		this._firstRender = false;
	} else if (this.isClosed){
		// a previously closed layout means we need to 
		// completely re-initialize the regions
		this._initializeRegions();
	} else {
		// If this is not the first render call, then we need to 
		// re-initializing the `el` for each region
		this._reInitializeRegions();
	}

	var args = Array.prototype.slice.apply(arguments);
	var result = Marionette.ItemView.prototype.render.apply(this, args);

	// run through regions, create views for each region
	this._createRegionViews();

	return result;
};

// 
// Clola
// 
Backbone.Collection.prototype.search = function (term, options) {
	var that = this;
	term = term || "";

	var terms = term.split(" ");

	options = options || {};
	// included and excluded attributes
	var includes = _.invert(options.includes) || {};
	var excludes = _.invert(options.excludes) || {};

	var array = [];

	if(!terms.length) {
		return array;
	}
	
	that.each( function( model ){
		var attributes = model.attributes;
		
		var values = [];

		for(var key in attributes) {
			if((_.isEmpty(includes) || includes[key]) && (
			   _.isEmpty(excludes) || !excludes[key])) {
				values.push(attributes[key]);
			}
		}

		values = values.join(" ");

		var has_terms = true;

		_.each(terms, function(term) {
			var reg = new RegExp($.trim( term ), "i");

			if(!reg.test(values)) {
				has_terms = false;
				return;
			}
		});

		if(has_terms) {
			array.push(model);
		}

		if(array.length > 50) {
			return;
		}

	});

	return array;
};

// ---------------------------------------------- Observers

Backbone.Model.prototype.observe = function (observedAttrs, context) {
	context = context || this;
	_.each(observedAttrs, function (observedAttr) {
		context.on("change:" + observedAttr, function (attr) {
			var callbackName = "onChange" + _.toTitleCase(observedAttr.replace(/_/g, ' ')).replace(/\s/g, '');
			context[callbackName](context.get(observedAttr));
		});
	});
};

// ---------------------------------------------- Rendering

Backbone.View.prototype.appendTo = function ($target) {
	$target.append(this.render().$el);
	this.trigger("on:dom");
	if (this.onDom) {
		this.onDom();
	}
};

Backbone.View.prototype.htmlFor = function ($target) {
	$target.html(this.render().$el);
	this.trigger("on:dom");
	if (this.onDom) {
		this.onDom();
	}
};

Backbone.View.prototype.replace = function ($target) {
	$target.replaceWith(this.render().$el);
	this.trigger("on:dom");
	if (this.onDom) {
		this.onDom();
	}
};

Backbone.View.prototype.close = function () {
	this.remove();
	this.unbind(); // unbind events the view triggers directly (i.e. that.trigger)
	this.unbindAll(); // unbind anything that was bound using that.bindTo

	if (this.onClose) {
		this.onClose();
	}

	if (this.childViews) {
		_.each(this.childViews, function (view) {
			view.close();
		});
	}
};

// ---------------------------------------------- Bindings

Backbone.View.prototype.bindTo = function (object, eventName, callback, context) {
	context = context || this;
	this._eventBindings = this._eventBindings || [];

	object.on(eventName, callback, context);

	var binding = {
		object:object,
		eventName:eventName,
		callback:callback,
		context:context
	};

	this._eventBindings.push(binding);

	return binding;
};

Backbone.View.prototype.unbindFrom = function (binding) {
	binding.object.off(binding.eventName, binding.callback, binding.context);
	this._eventBindings = _.reject(this._eventBindings, function (b) {
		return b === binding;
	});
};

Backbone.View.prototype.unbindAll = function () {
	var that = this;
	var bindings = _.map(this._eventBindings, _.identity);
	_.each(bindings, function (binding, index) {
		that.unbindFrom(binding);
	});
};
