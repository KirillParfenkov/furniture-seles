define([
  'jquery',
  'underscore',
  'backbone',
  'models/category'
], function( $, _, Backbone, Category ) {
	 var Categories = Backbone.Collection.extend({
	 	models: Category,
	 	url : 'http://localhost:1337/api/categories'
	 });
	 return Categories;
});