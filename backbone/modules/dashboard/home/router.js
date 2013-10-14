// HomeRouter = Backbone.Router.extend({
//   constructor:function () {
//     var that = this;

//     // ------------------------------------------ Config

//     that.routes = {
//       "dashboard": "home"
//     };

//     that.initialize = function() {
//       App.businesses = App.businesses || new BusinessesCollection();
//       App.businesses.load();
//     };


//     that.home = function(params) {
//       var dash = new DashLayout();
//       dash.render();

//       waitFor(function() {
//         return App.businesses.loaded;
//       }, function() {
//         var view;
//         if(App.businesses.length) {
//           view = new VendorsCompositeView({
//             collection: App.businesses
//           });
//         } else {
//           view = new VendorEmptyView();
//         }

//         dash.body.show(view);
//       });
//     };

//     // that.customers = function(params) {
//     //   var dash = new DashLayout();
//     //   dash.render();

//     //   waitFor(function() {
//     //     return that.vendors.loaded;
//     //   }, function() {
//     //     // var view = new VendorsCompositeView({
//     //     //   collection: that.vendors
//     //     // });

//     //     // dash.body.show(view);
//     //   });
//     // };

//     return Backbone.Router.apply(that, arguments);
//   }

// });