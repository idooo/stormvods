module.exports.tasks = {

	copy: {
		images: {
			files: [
				{
					expand: true,
					dest: '<%= settings.webDist %>/images',
					cwd: '<%= settings.webAssets %>/images',
					src: ['**/*']
				},
				{
					expand: true,
					dest: '<%= settings.webDist %>/fonts',
					cwd: '<%= settings.webAssets %>/fonts',
					src: ['**/*']
				}
			]
		}
	}
};
