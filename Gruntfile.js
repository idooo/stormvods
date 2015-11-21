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

	grunt.registerTask('serve', [
		'sass',
		'copy:images',
		'browserify',
		'develop:normal',
		'watch'
	]);

	grunt.registerTask('test', [
		'eslint'
		// tests
	]);

};
