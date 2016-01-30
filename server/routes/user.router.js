'use strict';

const API_USERS_LIST = '/api/users';
const API_USERS_ME = '/api/users/me';
const API_USER = '/api/user';

var Router = require('./abstract.router'),
	Constants = require('../constants');


const LIST_PAGE_SIZE = 20;

class UsersRouter extends Router {

	configure () {
		/**
		* @api {get} /api/users/me Get information about auth user
		* @apiName Me
		* @apiGroup User
		* @apiPermission USER
		* @apiVersion 1.0.0
		*/
		this.bindGET(API_USERS_ME, this.routeMe, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		/**
		* @api {post} /api/user Create a user
		* @apiName AddUser
		* @apiGroup User
		* @apiPermission ADMIN
		* @apiVersion 1.0.0
		*
		* @apiDescription
		* For testing purposes only
		*/
		this.bindPOST(API_USER, this.routeAddUser, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		/**
		* @api {get} /api/users Get list of users
		* @apiName GetUser
		* @apiGroup User
		* @apiPermission ADMIN
		* @apiVersion 1.0.0
		*
		* @apiDescription
		* Allowed only for admin
		*
		* @apiParam {Object} [query] db query
		* @apiParam {Object} [sort] db sort
		*/
		this.bindGET(API_USERS_LIST, this.routeUsers, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		/**
		 * @api {put} /api/user Change user
		 * @apiName ChangeUser
		 * @apiGroup User
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Allowed only for admin
		 *
		 * @apiParam {ObjectId} id User id
		 * @apiParam {Object} update fields to update
		 */
		this.bindPUT(API_USER, this.updateUser, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	routeMe (req, res, next, auth) {
		this.models.User.findOne({name: auth.name}, '_id name role votes')
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
		var self = this,
			page = parseInt(req.params.p, 10) || 1,
			query = req.params.query || {}, // only for admins so do not care for now
			sort = req.params.sort || {'_id': -1}, // sort by date, latest first by default
			fields = '-__v -votes';

		try {
			query = JSON.parse(query);
			sort = JSON.parse(sort);
		}
		catch (e) {
			Router.fail(res, e);
			return next();
		}

		self.models.User.paginate(query, {
				page: page,
				sort: sort,
				limit: LIST_PAGE_SIZE,
				select: fields
			})
			.then(function (data) {
				Router.success(res, {
					users: data.docs,
					pageCount: data.pages,
					itemCount: data.total,
					currentPage: data.page
				});
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}

	routeAddUser (req, res, next) {
		var user = new this.models.User({
			name: Router.filter(req.params.name),
			role: parseInt(req.params.role, 10) || Constants.ROLES.USER,
			redditInfo: {
				id: Math.random()
			}
		});
		user.save(function (err, createdUser) {
			if (err) {
				Router.fail(res, err);
				return next();
			}
			else {
				Router.success(res, createdUser);
				return next();
			}
		});
	}

	updateUser (req, res, next) {

		var id = this.models.ObjectId(req.params.id),
			update = req.params.update;

		if (!id) {
			Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
			return next();
		}

		this.models.User.updateOne({_id: id}, update)
			.then(() => {
				Router.success(res);
				return next();
			})
			.catch(e => {
				Router.fail(res, e);
				return next();
			});
	}
}

module.exports = UsersRouter;
