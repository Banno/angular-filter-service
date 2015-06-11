module.exports = function(config) {
	'use strict';
	config.set({
		basePath: '../',
		files: [
			{ pattern: 'bower_components/**/*.js', included: false },
			{ pattern: 'node_modules/**/*.js', included: false },
			{ pattern: 'dist/*.js', included: false },
			{ pattern: 'test/test-*.js', included: false },
			'test/requirejs.conf.js',
		],
		frameworks: ['jasmine', 'requirejs'],
		browsers: ['PhantomJS'],
		reporters: ['dots']
  });
};
