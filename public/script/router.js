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
    catalogueTree : [],
    routes: {
      'catalogue/:categoryId' : 'renderCatalogue',
      'catalogue' : 'renderCatalogue',
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

    renderCatalogue : function ( categoryId ) {

      var id = this.getURLParameter('id');
      this.views['submenu'].render( { categoryId : categoryId } );
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
