module.exports.tasks = {

	clean: {
		default: {
			files: [
				{dot: true, src: ['<%= settings.webDist %>/*', '!<%= settings.webDist %>/.git*']}
			]
		},
		docs: {
			files: [
				{src: ['<%= settings.docs %>/*']}
			]
		}
	}
};
