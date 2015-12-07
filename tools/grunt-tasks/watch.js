module.exports.tasks = {

	watch: {
		sass: {
			files: ['<%= settings.webAssets %>/**/*.scss'],
			tasks: ['sass']
		},
		apidoc: {
			files: ['<%= settings.server %>/**/*.js'],
			tasks: ['apidoc']
		}
	}
};
