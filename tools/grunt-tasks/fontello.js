module.exports.tasks = {

	fontello: {

		dist: {
			options: {
				config  : 'fontello.json',
				fonts   : '<%= settings.webAssets %>/fonts',
				styles  : '<%= settings.webAssets %>',
				scss    : true,
				force   : true,
				exclude: [
					'animation.css',
					'fontello-ie7-codes.css',
					'fontello-ie7.css',
					'fontello-codes.css',
					'fontello-embedded.css'
				]
			}
		}
	}
};
