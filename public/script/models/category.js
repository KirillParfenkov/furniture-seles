define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Category = Backbone.Model.extend({
		urlRoot : 'http://localhost:1337/api/categories',
		initialize: function(){
    	}
	});

	return Category;
});