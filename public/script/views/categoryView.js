define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'models/category',
  'collections/categories',
  'collections/furnitures',
  'text!templates/categoryView.html',
], function ($, _, Backbone, async, Category, Categories, Furnitures, contentTemplate ) {
	var ContentView = Backbone.View.extend({
		el : '.contentContainer',
		template : contentTemplate,
		render : function( src, callback ) {
			var view = this;
			var categoryId = src.categoryId;

			if ( categoryId ) {
				var furnitures = new Furnitures();
				furnitures.url = 'furnituresByCategory/' + categoryId;
				furnitures.fetch({
					success : function( result ) {
						var furnituresVar = result.toJSON();
						var table = [];
						var index = -1;
						for ( var i = 0; i < furnituresVar.length; i++ ) {
							if ( !(i%4) ) {
								++index;
								table[index] = [];
							}
							table[index].push(furnituresVar[i]);
						}
						console.log( furnituresVar );
						$(view.el).html(_.template( view.template, { furTable : table, categoryId : categoryId } ));
						if ( callback ) {
							callback();
						}
					},
					error : function( err ) {
						console.log( err );
						if ( callback ) {
							callback( err );
						}
					}
				});
			}

			

		}
	});
	return ContentView;
});