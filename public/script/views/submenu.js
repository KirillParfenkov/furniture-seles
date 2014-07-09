define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/submenu.html' 
], function ($, _, Backbone, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.sabmenuContainer',
		template : contentTemplate,
		hierarchy : null,

		prepare : function ( src, callback ) {
			var categories = src.categories;
			this.hierarchy = [];

			for( var i = 0; i < categories.length; i++ ) {
				var catName = 'category' + i;
				this.hierarchy.push([
					{ link: '#', name: catName + '1', label: catName + '1', active: (catName + '1') == categories[i] },
					{ link: '#', name: catName + '2', label: catName + '2', active: (catName + '2') == categories[i] },
					{ link: '#', name: catName + '3', label: catName + '3', active: (catName + '3') == categories[i] },
					{ link: '#', name: catName + '4', label: catName + '4', active: (catName + '4') == categories[i] },
					{ link: '#', name: catName + '5', label: catName + '5', active: (catName + '5') == categories[i] },
				]);
			}
			
			callback( this.hierarchy );
		},

		render : function ( src, callback ) {
			var view = this;
			$(this.el).html(_.template(contentTemplate, { hierarchy: view.hierarchy }));
		}
	});
	return ContentView;
});