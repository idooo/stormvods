'use strict';

var Router = require('./abstract.router');

class UsersRouter extends Router {

	configure () {
		this.bindGET('/api/users/me', this.routeMe, {auth:true}); 
		this.bindGET('/api/users', this.routeData); // TODO: Remove
	}
	
	routeMe (req, res, next, username) {
		this.models.User.findOne({name: username}, '_id name')
			.then(function (user) {
				Router.success(res, user);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
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

module.exports = UsersRouter;
