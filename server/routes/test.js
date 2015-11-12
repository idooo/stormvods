'use strict';

var Route = require('./abstract.route');

class TestRoute extends Route {

	configure() {
		var self = this;

		self.server.get('/api/data', function (req, res, next) {

			self.model.Datasource.getDatasources()
				.then(function(datasources) {
					Route.success(res, datasources);
					return next();
				})
				.catch(function(err) {
					Route.fail(res, err);
					return next();
				});
		})
	}
}

module.exports = TestRoute;