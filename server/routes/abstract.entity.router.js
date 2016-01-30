'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	_flatten = require('lodash/array/flatten'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const LIST_PAGE_SIZE = 100;

class AbstractEntityRouter extends Router {

	bindRoutes (routeName, model) {
		this.model = model;

		this.bindPOST(`/api/${routeName}`, this.addRoute, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		this.bindDELETE(`/api/${routeName}/:id`, this.removeRoute, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		this.bindGET(`/api/${routeName}s`, this.listRoute, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindPUT(`/api/${routeName}`, this.updateRoute, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	addRoute (req, res, next, auth) {
		// Validate params
		var name = Router.filter(req.params.name);

		var modelInstance = this.model({
			name,
			author: auth.id
		});

		modelInstance.save(function (err, responseFromDB) {
			if (err) {
				logger.debug(_omit(err, 'stack'));
				Router.fail(res, err);
				return next();
			}
			else {
				Router.success(res, _pick(responseFromDB, ['_id', 'name']));
				return next();
			}
		});
	}

	listRoute (req, res, next, auth) {
		var self = this,
			fields = '-isRemoved -__v',
			page = parseInt(req.params.p, 10) || 1,
			pageCount,
			itemCount,
			currentPage,
			items;

		if (auth && auth.role >= Constants.ROLES.ADMIN) fields = '-__v';

		self.model.paginate({}, {
				page: page,
				sort: {'_id': -1}, // sort by date, latest first
				limit: LIST_PAGE_SIZE,
				select: fields
			})
			.then(function (result) {
				pageCount = result.pages;
				itemCount = result.total;
				currentPage = result.page;
				items = result.docs;

				// we will also return real user names
				let _ids = [];
				for (let i = 0; i < items.length; i++) {
					_ids.push(items[i].author);
				}
				return self.models.User.getList({_id: {'$in' : _ids}});
			})
			.then(function (users) {
				var lookup = {};
				_flatten(users).forEach(i => lookup[i._id] = i);

				for (let i = 0; i < items.length; i++) {
					items[i] = items[i].toObject();
					if (lookup[items[i].author]) {
						items[i].author = {
							name: lookup[items[i].author].name,
							_id: lookup[items[i].author]._id
						};
					}
					else {
						items[i].author = {
							name: '[deleted]',
							_id: items[i].author
						};
					}
				}

				Router.success(res, {items, pageCount, itemCount, currentPage});
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}

	updateRoute (req, res, next) {

		var id = this.models.ObjectId(req.params.id),
			update = req.params.update;

		if (!id) {
			Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
			return next();
		}

		this.model.findOneAndUpdate({_id: id}, update)
			.then(() => {
				Router.success(res);
				return next();
			})
			.catch(e => {
				Router.fail(res, e);
				return next();
			});
	}

	removeRoute (req, res, next) {

		var id = this.models.ObjectId(req.params.id);

		if (!id) return Router.notFound(res, next, req.params.id);

		this.model.findOneAndUpdate({_id: id}, {isRemoved: true})
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

module.exports = AbstractEntityRouter;
