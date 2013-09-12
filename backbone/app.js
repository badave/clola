var App = new Backbone.Marionette.Application();

App.on("initialize:after", function(options){
  Backbone.history.start({pushState: true});
});