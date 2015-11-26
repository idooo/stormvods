'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	Constants = require('../constants'),
	Router = require('../routes/abstract.router');

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

			var tournament = new model({
				name,
				author: auth.id
			});

			tournament.save(function (err, responseFromDB) {
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

}

module.exports = RouteFactory;
