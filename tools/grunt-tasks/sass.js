module.exports.tasks = {

	sass: {
		options: {
			sourceMap: true,
			includePaths: require('node-bourbon').with(require('node-neat').includePaths)
		},
		dist: {
			files: {
				'<%= settings.webDist %>/styles/main.css': '<%= settings.webAssets %>/index.scss'
			}
		}
	}
};
