// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
], function ($, _, Backbone) {
  var AppRouter = Backbone.Router.extend({
    viewList : [],
    tabViewMap : {},
    sideBar : {},
    setupViews : [],
    routes: {
      'clak/:str' : 'clak' 
    },

    initialize : function (options, callback) {
      callback();
    },

    clak : function( str ) {
      alert(str + 'clak!');
    }


  }); 

  var initialize = function(options, callback){
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
