'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants');

class UsersRouter extends Router {

	configure () {
		this.bindGET('/api/users/me', this.routeMe, {auth:true}); 
		this.bindGET('/api/users', this.routeUsers); // TODO: Remove
	}
	
	routeMe (req, res, next, auth) {
		this.models.User.findOne({name: auth.name}, '_id name')
			.then(function (user) {
				if (!user) Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
				else Router.success(res, auth);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
	
	routeUsers (req, res, next) {
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

module.exports = UsersRouter;
