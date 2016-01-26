'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	_flatten = require('lodash/array/flatten'),
	Constants = require('../constants'),
	Router = require('../routes/abstract.router');

const LIST_PAGE_SIZE = 100;

class RouteFactory {

	constructor () {

	}

	/**
	 * Generate new route to remove entity by {id}
	 *
	 * Required url param for returned route:
	 * - id {string > ObjectId}
	 *
	 * Optional body params for returned route:
	 * - permanent {Boolean} [optional] removes record from db permanently
	 */
	static generateRemoveRoute (model) {

		return function (req, res, next) {

			var id = this.models.ObjectId(req.params.id),
				body = Router.body(req);

			if (!id) return Router.notFound(res, next, req.params.id);

			if (body.permanent) {
				model.removeOne({_id: id})
					.then(function () {
						Router.success(res);
						logger.info(`Entity "${id}" has been permanently removed`);
						return next();
					})
					.catch(function (err) {
						logger.debug(err);
						Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
						return next();
					});
			}
			else {
				model.findOne({_id: id}, 'isRemoved')
					.then(function (entity) {
						if (entity) {
							if (!entity.isRemoved) return entity.markAsRemoved();
							else Router.fail(res, {message: Constants.ERROR_ALREADY_REMOVED});
						}
						else Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);

						return next();
					})
					.then(function () {
						Router.success(res);
						return next();
					})
					.catch(function (err) {
						Router.fail(res, err);
						return next();
					});
			}
		};
	}

	static generateAddRoute (model) {
		return function (req, res, next, auth) {
			// Validate params
			var name = Router.filter(req.params.name);

			var modelInstance = new model({
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
		};
	}

	static generateGetListRoute (model) {

		return function (req, res, next, auth) {
			var self = this,
				fields = '-isRemoved -__v',
				page = parseInt(req.params.p, 10) || 1,
				pageCount,
				itemCount,
				currentPage,
				items;

			if (auth && auth.role >= Constants.ROLES.ADMIN) fields = '-__v';

			model.paginate({}, {
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
		};
	}

	static generateUpdateRoute (model) {

		return function (req, res, next) {

			var id = this.models.ObjectId(req.params.id),
				update = req.params.update;

			if (!id) {
				Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
				return next();
			}

			model.updateOne({_id: id}, update)
				.then(() => {
					Router.success(res);
					return next();
				})
				.catch(e => {
					Router.fail(res, e);
					return next();
				});
		};
	}

}

module.exports = RouteFactory;
