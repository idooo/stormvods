'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	_flatten = require('lodash/array/flatten'),
	errors = require('../core/errors'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const LIST_PAGE_SIZE = 150;

class AbstractEntityRouter extends Router {

	/**
	 * @param {String} routeName
	 * @param {AbstractModel} model
	 * @param {String} [videoField] Field name in video object for that entity
     */
	bindRoutes (routeName, model, videoField) {
		this.model = model;
		this.fieldName = videoField || routeName;

		this.bindGET(`/api/${routeName}s`, this.listRoute, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindPOST(`/api/${routeName}`, this.addRoute, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		this.bindDELETE(`/api/${routeName}/:id`, this.removeRoute, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		this.bindPUT(`/api/${routeName}`, this.updateRoute, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		this.bindPOST(`/api/${routeName}/merge`, this.mergeRoute, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
     * @param auth
     */
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

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
     * @param auth
     */
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
				sort: {'date': 1, 'name': 1}, // sort by date, and then by name
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
				return self.models.User.find({_id: {'$in' : _ids}});
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

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
     * @returns {*}
     */
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

	/**
	 * Pretty slow operation
	 * After marking entity as removed we have to go through all the videos
	 * and remove it from there. If entity is a part of group
	 *
	 * @param req
	 * @param res
	 * @param next
     * @returns {*}
     */
	removeRoute (req, res, next) {
		var self = this,
			id = self.models.ObjectId(req.params.id);

		if (!id) return Router.notFound(res, next, req.params.id);

		self.model.findOneAndRemove({_id: id})
			.then(() => {
				// get all the videos (extremely slow)
				return self.models.Video.find({}, `_id ${self.fieldName}`);
			})
			.then(function (videos) {
				var promises = [];

				// iterate over videos
				for (let i = 0; i < videos.length; i++) {
					// iterate over entities we need to search by id
					for (let j = 0; j < videos[i][self.fieldName].length; j++) {
						// go to next entity if we didn't find entity we need
						// for teams and casters
						// video.teams.0.teams [] for example
						if (videos[i][self.fieldName][j][self.fieldName]) {
							if (!videos[i][self.fieldName][j][self.fieldName][0].equals(id) &&
								!videos[i][self.fieldName][j][self.fieldName][1].equals(id)) continue;
						}
						// for tournaments
						else if (!videos[i][self.fieldName][j]._id.equals(id)) continue;

						// remove entity from the list
						videos[i][self.fieldName].splice(j, 1);

						// update video
						promises.push(
							self.models.Video.update({_id: videos[i]._id}, {
								[self.fieldName]: videos[i][self.fieldName]
							})
						);
					}
				}
				return Promise.all(promises);
			})
			.then(() => {
				Router.success(res);
				return next();
			})
			.catch(e => {
				logger.error(e.stack);
				Router.fail(res, e);
				return next();
			});
	}

	/**
	 * Merge entity (source) to a target (target)
	 * src - id
	 * target - id
	 *
	 * @param req
	 * @param res
	 * @param next
     * @returns {*}
     */
	mergeRoute (req, res, next) {
		var self = this,
			src = self.models.ObjectId(req.params.src),
			target = self.models.ObjectId(req.params.target);

		if (!src) return Router.notFound(res, next, req.params.src);
		if (!target) return Router.notFound(res, next, req.params.target);

		self.model.findOne({_id: target}, '_id')
			.then(entity => {
				if (!entity) throw new errors.GenericAPIError(Constants.ERROR_NOT_FOUND);
				return self.model.findOneAndRemove({_id: src}); // remove entity
			})
			.then(() => {
				// get all the videos (extremely slow)
				return self.models.Video.find({}, `_id ${self.fieldName}`);
			})
			.then(function (videos) {
				var promises = [];

				// iterate over videos
				for (let i = 0; i < videos.length; i++) {
					// iterate over entities we need to search by id
					for (let j = 0; j < videos[i][self.fieldName].length; j++) {
						// go to next entity if we didn't find entity we need
						// for teams and casters
						// video.teams.0.teams [] for example
						if (videos[i][self.fieldName][j][self.fieldName]) {
							if (videos[i][self.fieldName][j][self.fieldName][0].equals(src)) {
								videos[i][self.fieldName][j][self.fieldName][0] = target;
							}
							else if (videos[i][self.fieldName][j][self.fieldName][1].equals(src)) {
								videos[i][self.fieldName][j][self.fieldName][1] = target;
							}
							else continue;
						}
						// for tournaments
						else if (videos[i][self.fieldName][j]._id.equals(src)) {
							videos[i][self.fieldName][j]._id = target;
						}
						else continue;

						// update video
						promises.push(
							self.models.Video.update({_id: videos[i]._id}, {
								[self.fieldName]: videos[i][self.fieldName]
							})
						);
					}
				}
				return Promise.all(promises);
			})
			.then(() => {
				Router.success(res);
				return next();
			})
			.catch(err => {
				if (!err.isApiError) {
					logger.error(err.stack);
					Router.fail(res, {message: Constants.ERROR_INTERNAL}, 500);
				}
				else Router.fail(res, {message: err.message}, 400);
				return next();
			});
	}
}

module.exports = AbstractEntityRouter;
