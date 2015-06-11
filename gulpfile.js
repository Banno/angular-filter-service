'use strict';

var del         = require('del');
var gulp        = require('gulp');
var header      = require('gulp-header');
var jshint      = require('gulp-jshint');
var karma       = require('karma').server;
var pkg         = require('./package.json');
var rename      = require('gulp-rename');
var runSequence = require('run-sequence').use(gulp);
var stylish     = require('jshint-stylish');
var uglify      = require('gulp-uglify');
var umd         = require('gulp-umd');

var jsFiles = [
	'gulpfile.js',
	'angular-filter-service.js',
	'test/*.js'
];

gulp.task('lint', function() {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('clean', function(done) {
	del('./dist', done);
});

gulp.task('build', ['clean'], function() {
	var banner = ['/*!',
		' * <%= pkg.name %> v<%= pkg.version %>',
		' * <%= pkg.homepage %>',
		' * (c) 2015 Jack Henry & Associates Inc',
		' * License: <%= pkg.license %>',
		' */',
		''].join('\n');

	return gulp.src('angular-filter-service.js')
		.pipe(umd({
			dependencies: function() {
				return [{
					name: 'angular',
					amd: 'angular',
					cjs: 'angular',
					global: 'angular',
					param: 'angular',
				}];
			},
			exports: function() { return '"banno.filterService"'; },
			namespace: function() { return 'banno = root.banno || {}; root.banno.filterService'; }
		}))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify({ preserveComments: 'some' }))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('test', function(done) {
	karma.start({
		configFile: __dirname + '/test/karma.conf.js',
		singleRun: true
	}, function() { done(); });
});

gulp.task('all', function(done) {
	return runSequence(['lint', 'build'], 'test', done);
});

gulp.task('watch', function() {
	gulp.watch(jsFiles.concat('.jshintrc'), ['all']);
});

gulp.task('default', ['all', 'watch']);
