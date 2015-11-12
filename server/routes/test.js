'use strict';

var Route = require('./abstract.route');

class TestRoute extends Route {

	configure() {
		this.server.get('/api/data', this.routeData.bind(this))
	}
	routeData(req, res, next) {
		this.model.Datasource.getDatasources()
			.then(function(datasources) {
				Route.success(res, datasources);
				return next();
			})
			.catch(function(err) {
				Route.fail(res, err);
				return next();
			});
	}
}

module.exports = TestRoute;