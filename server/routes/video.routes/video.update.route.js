'use strict';

/**
 * @api {put} /api/video Change Video
 * @apiName ChangeVideo
 * @apiGroup Video
 * @apiPermission ADMIN
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Allowed only for admin
 *
 * @apiParam {ObjectId} id Video id
 * @apiParam {Object} update fields to update
 */

var Router = require('./../abstract.router'),
	Constants = require('../../constants');

class VideoUpdateRoute {

	static route (req, res, next) {
		var self = this,
			id = this.models.ObjectId(req.params.id),
			update = req.params.update;

		if (!id) {
			Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
			return next();
		}

		self.models.Video.findOneAndUpdate({_id: id}, update)
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

module.exports = VideoUpdateRoute;
