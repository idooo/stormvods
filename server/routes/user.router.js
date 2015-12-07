/**
 * @api {get} /users Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
const API_USERS_LIST = '/api/users';

const API_USERS_ME = '/api/users/me';

'use strict';

var Router = require('./abstract.router'),
	Constants = require('../constants');

class UsersRouter extends Router {

	configure () {
		this.bindGET(API_USERS_ME, this.routeMe, {auth: true});
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
