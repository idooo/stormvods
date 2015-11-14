'use strict';

var Router = require('./abstract.router'),
	Database = require('../core/database');

class TestRouter extends Router {

	configure () {
		this.models = new Database().models;
		this.bind('/api/users', this.routeData, {auth:true});
	}
	routeData (req, res, next) {
		this.models.User.getList()
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
