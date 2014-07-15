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

		render : function ( src, callback ) {
			var view = this;
			var categories = src.categories;
			var hierarchy = [];
			var categoryId = src.categoryId;

			var categoriesVar = [
				{
					id : 1,
					name : 'Test 1'
				},
				{
					id : 2,
					name : 'Test 2'
				},
				{
					id : 3,
					name : 'Test 3'
				},
				{
					id : 4,
					parentId : 1,
					name : 'Sub 1'
				},
				{
					id : 5,
					parentId : 1,
					name : 'Sub 2'
				},
				{
					id : 6,
					name : 'T 1',
					parentId : 4,
				},
				{
					id : 7,
					name : 'T 2',
					parentId : 4
				},
				{
					id : 8,
					name : 'T 3',
					parentId : 4
				},
				{
					id : 9,
					name : 'T 11',
					parentId : 4
				},
				{
					id : 10,
					parentId : 4,
					name : 'T 22'
				}
			];

			var categoryTreeMap = {};
			var firstLavel = [];

			for( var i = 0; i < categoriesVar.length; i++  ) {
				categoryTreeMap[ categoriesVar[i].id ] = {
					id: categoriesVar[i].id,
					label : categoriesVar[i].name,
					parentId : categoriesVar[i].parentId,
					data : []
				};
			}

			for( var i = 0; i < categoriesVar.length; i++  ) {
				if ( categoriesVar[i].parentId ) {
					categoryTreeMap[ categoriesVar[i].parentId ].data.push( categoryTreeMap[categoriesVar[i].id] );
				} else {
					firstLavel.push( categoryTreeMap[categoriesVar[i].id] );
				}
			}

			if ( categoryId ) {
				if ( categoryTreeMap[categoryId].data ) {
				hierarchy.push( categoryTreeMap[categoryId].data );
				}

				var parentId = categoryTreeMap[categoryId].parentId;
				while ( parentId ) {
					var currentNode = categoryTreeMap[parentId];
					if ( currentNode.data && currentNode.data.length > 0) {
						hierarchy.push( currentNode.data );
					}
					parentId = currentNode.parentId;
				}
			}

			hierarchy.push( firstLavel );
			hierarchy.reverse();

		    var itemCount = 0;
        	for( var i = 0; i < hierarchy.length; i++) {
          		if ( itemCount < hierarchy[i].length ) {
            		itemCount = hierarchy[i].length;
          		}
        	}

		    view.renderSubmenuContainer( itemCount, 19, 5,  function() {
          		$(view.el).html(_.template(contentTemplate, { hierarchy: hierarchy }));
          		if ( callback ) {
					callback();
				}
        	});
		},

		renderSubmenuContainer : function( itemCount, itemSize, padding, callbak ) {  
      		$('.sabmenuContainer').addClass('active');
      		$('.sabmenuContainer').animate({ height: (itemCount * itemSize + padding) }, 500, "linear", callbak);
    	},

    	hideSubmenuContainer : function( callbak ) {
      		$('.sabmenuContainer').removeClass('active');
      		$('.sabmenuContainer').animate( { height: 0 }, 100, "linear", callbak );
    	}
	});
	return ContentView;
});