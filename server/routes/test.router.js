'use strict';

var Router = require('./abstract.router');

class TestRouter extends Router {

	configure () {
		this.bind('/api/users', this.routeData, {auth:true});
	}
	routeData (req, res, next) {
		this.model.User.getList()
			.then(function (datasources) {
				Router.success(res, datasources);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = TestRouter;
