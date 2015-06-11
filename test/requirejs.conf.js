/* jshint browser:true */
var tests = [];
for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		if (/base\/test\/test-.+\.js$/.test(file)) {
			tests.push(file);
		}
	}
}

requirejs.config({
	// Karma serves files from '/base'.
	baseUrl: '/base',

	deps: tests,

	shim: {
		angular: {
			exports: 'angular'
		},
		'angular-mocks': {
			deps: ['angular']
		}
	},

	paths: {
		'angular': 'bower_components/angular/angular',
		'angular-mocks': 'node_modules/angular-mocks/angular-mocks',
		'banno/filterService': 'dist/angular-filter-service'
	},

	// Start the test run once RequireJS is done.
	callback: window.__karma__.start
});

define('testModule', ['banno/filterService', 'angular-mocks'], function(){});
