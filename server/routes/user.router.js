'use strict';

const API_USERS_LIST = '/api/users';
const API_USERS_ME = '/api/users/me';

var Router = require('./abstract.router'),
	Constants = require('../constants');


class UsersRouter extends Router {

	configure () {
		/**
		* @api {get} /api/users/me Get information about auth user
		* @apiName Me
		* @apiGroup User
		* @apiPermission USER
		* @apiVersion 1.0.0
		*/
		this.bindGET(API_USERS_ME, this.routeMe, {auth: true});
		
		/**
		* @api {get} /api/users Get list of users
		* @apiName GetUser
		* @apiGroup User
		* @apiPermission ADMIN
		* @apiVersion 1.0.0
		*/
		this.bindGET(API_USERS_LIST, this.routeUsers, {auth: true, restrict: Constants.ROLES.ADMIN});
	}

	routeMe (req, res, next, auth) {
		this.models.User.findOne({name: auth.name}, '_id name votes role')
			.then(function (user) {
				if (!user) Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
				else Router.success(res, user);
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
