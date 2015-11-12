module.exports.tasks = {

	watch: {
		sass: {
			files: ['<%= settings.webAssets %>/**/*.scss'],
			tasks: ['sass']
		}
	}
};
