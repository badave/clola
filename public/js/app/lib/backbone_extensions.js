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

Backbone.Marionette.ItemView.prototype.context = Backbone.Marionette.CompositeView.prototype.context = function(modelJson) {
  return {
    model: modelJson
  };
};

Backbone.Marionette.ItemView.prototype.initialize = Backbone.Marionette.CompositeView.prototype.initialize =function(options) {
  // Autoextends
  _.extend(this, options);
  _.bindAll(this, "template");
};

Backbone.Marionette.ItemView.prototype.template = Backbone.Marionette.CompositeView.prototype.template =  function(modelJson) {
  if(!this.template_path) { throw new Error("Add a template path to your view.  If you're getting this error and you have a template_path, your initializer needs _.bindAll(this, 'template'); in it, or override template"); }
  var template = Handlebars.templates[this.template_path];
  return template(this.context(modelJson));
};
