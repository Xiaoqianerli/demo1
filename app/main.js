requirejs.config({
	paths: {
		'text': '../lib/require/text',
		'jquery': '../lib/jquery/jquery-1.9.1.min',
		'knockout': '../lib/knockout/knockout-3.4.0',
		'durandal': '../lib/durandal/js',
		'transitions': '../lib/durandal/js/transitions',
		'plugins': '../lib/durandal/js/plugins',
		'bootstrap': '../lib/bootstrap/js/bootstrap.min',
		'cab': '../js'
	},
	urlArgs: '1.0.0' + Math.random()
});

define(function(require) {

	var system = require('durandal/system');
	var app = require('durandal/app');

	system.debug(true);
	
	app.title = 'SPA';

	app.configurePlugins({
		router: true,
		dialog: true,
		widget: {
			kinds: ['expander']
		}
	});

	app.start().then(function() {
		app.setRoot('shell', null, 'container');
	});
});