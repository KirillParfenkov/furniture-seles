// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/content',
  'views/submenu'
], function ($, _, Backbone, contentView, submenuView) {
  var AppRouter = Backbone.Router.extend({
    views : [],
    tabViewMap : {},
    sideBar : {},
    setupViews : [],
    routes: {
      'catalogue/*path' : 'renderCatalogue',
      'shares' : 'renderShares',
      'novelties' : 'renderNovelties',
      'contacts' : 'renderContacts',
      'whereBuy' : 'renderWhereBuy'
    },

    initialize : function (options, callback) {
      this.views['content'] = new contentView();
      this.views['submenu'] = new submenuView();
      callback();
    },

    renderCatalogue : function ( path ) {
      var router = this;
      var views = this.views;
      var categories = path.split("/");
      var id = this.getURLParameter('id');
      //views['content'].render({ categories : categories, id : id });
      views['submenu'].prepare({ categories : categories}, function( hierarchy ) {
        var itemCount = 0;
        for( var i = 0; i < hierarchy.length; i++) {
          if ( itemCount < hierarchy[i].length ) {
            itemCount = hierarchy[i].length;
          }
        }
        router.renderMenuItem( itemCount, 19, 5,  function() {
          views['submenu'].render();
        });
      });
    },

    renderShares : function () {
      console.log('renderShares');
    },

    renderNovelties : function () {
      console.log('renderNovelties');
    },

    renderContacts : function () {
      console.log('renderContacts');
    },

    renderWhereBuy : function () {
      console.log('renderWhereBuy');
    },

    renderMenuItem : function( itemCount, itemSize, padding, callbak ) {  
      $('.sabmenuContainer').addClass('active');
      $('.sabmenuContainer').animate({ height: (itemCount * itemSize + padding) }, 500, "linear", callbak);
    },

    hideSubmenuContainer : function( callbak ) {
      $('.sabmenuContainer').removeClass('active');
      $('.sabmenuContainer').animate( { height: 0 }, 100, "linear", callbak );
    },

    getURLParameter : function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.hash)||[,""])[1].replace(/\+/g, '%20'))||null;
    }
  }); 

  var initialize = function(options, callback){
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
