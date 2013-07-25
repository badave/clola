var App = new Backbone.Marionette.Application();

App.on("initialize:after", function(options){
  var appLayout = new AppLayout();
  
  App.layout = appLayout;

  $("body").append(appLayout.render().$el);

  Backbone.history.start({pushState: true});
});