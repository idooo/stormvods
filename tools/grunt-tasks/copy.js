module.exports.tasks = {

	copy: {
		images: {
			files: [
				{
					expand: true,
					dest: '<%= settings.webDist %>/images',
					cwd: '<%= settings.webAssets %>/images',
					src: ['**/*']
				}
			]
		}
	}
};
