var dashLayout = function() {
  if(!this.dashLayout) {
    this.dashLayout = new DashLayout();
    App.layout = this.dashLayout;
    $("body").html(App.layout.render().$el);
  }
};