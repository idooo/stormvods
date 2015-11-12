var routes = [,
	'test',
	'static'
];

module.exports = function(server, model, config) {

	server.use(function (req, res, next) {
		if (req.url.indexOf('/api') >= 0) config.logger.debug(req.method + ' ' + req.url);
		return next();
	});

	var Route;
	routes.forEach(function(routeName) {
		Route = require(__dirname + '/routes/' + routeName);
		new Route(server, model, config).configure();
	});
};