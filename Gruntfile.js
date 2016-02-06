module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var options = {
		config: {
			src: 'tools/grunt-tasks/*.js'
		},
		settings: {
			webSrc: 'web/src',
			webAssets: 'web/assets',
			webDist: 'web/dist',
			server: 'server',
			tmp: '.tmp',
			docs: 'docs'
		}
	};

	var configs = require('load-grunt-configs')(grunt, options);

	grunt.initConfig(configs);

	// Tasks

	grunt.registerTask('listen', [
		'sass',
		'apidoc',
		'copy:images',
		'browserify',
		'watch'
	]);

	grunt.registerTask('serve', [
		'clean',
		'sass',
		'apidoc',
		'copy:images',
		'browserify',
		'develop:normal',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean',
		'sass',
		'copy:images',
		'browserify',
		'cssmin',
		'uglify'
	]);
};
