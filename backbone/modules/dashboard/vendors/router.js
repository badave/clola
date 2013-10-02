// var VendorRouter = Backbone.Router.extend({
//   constructor:function () {
//     var that = this;

//     // ------------------------------------------ Config

//     that.routes = {
//       "dashboard": "vendor",
//       "dashboard/customers": "customers"
//     };

//     that.initialize = function() {
//       that.vendors = new VendorCollection();
//       that.vendors.load();
//     };


//     that.vendor = function(params) {
//       var dash = new DashLayout();
//       dash.render();

//       waitFor(function() {
//         return that.vendors.loaded;
//       }, function() {
//         var view = new VendorsCompositeView({
//           collection: that.vendors
//         });

//         dash.body.show(view);
//       });
//     };

//     that.customers = function(params) {
//       var dash = new DashLayout();
//       dash.render();

//       waitFor(function() {
//         return that.vendors.loaded;
//       }, function() {
//         // var view = new VendorsCompositeView({
//         //   collection: that.vendors
//         // });

//         // dash.body.show(view);
//       });
//     };

//     return Backbone.Router.apply(that, arguments);
//   }

// });