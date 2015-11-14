module.exports.tasks = {

	browserify: {
		dist: {
			options: {
				transform: ['babelify'],
				watch: true
			},
			files: {
				'<%= settings.webDist %>/scripts/app.js': '<%= settings.webSrc %>/app.js',
				'<%= settings.webDist %>/scripts/vendor.js': '<%= settings.webSrc %>/vendor.js'
			}
		}
	}
};
