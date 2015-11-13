'use strict';

var Route = require('./abstract.route');

class TestRoute extends Route {

	configure () {
		this.bind('/api/users', this.routeData, {auth:true});
	}
	routeData (req, res, next) {
		this.model.User.getList()
			.then(function (datasources) {
				Route.success(res, datasources);
				return next();
			})
			.catch(function (err) {
				Route.fail(res, err);
				return next();
			});
	}
}

module.exports = TestRoute;
