require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-2.1.1',
    underscore: 'libs/underscore/underscore', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone', // https://github.com/amdjs
    async: 'libs/async/async',

    // Require.js plugins
    text: 'libs/require/text',
    order: 'libs/require/order',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates',
    custom: '../custom'
  },
	urlArgs: "bust=" +  (new Date()).getTime()

});

// Let's kick off the application

require([
  'jquery',
  'router'
], function($, Router){
  console.log('Application was started!');
  Router.initialize({}, function() {
    console.log('Iniitialiased!');
    Backbone.history.start();
  });
});