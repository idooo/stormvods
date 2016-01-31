'use strict';

/**
 * @api {delete} /api/video/:id Delete video
 * @apiName DeleteVideo
 * @apiGroup Video
 * @apiPermission ADMIN
 * @apiVersion 1.0.0
 *
 * @apiParam {ObjectId} id video id
 * @apiParam {Boolean} [permanent] removes record from db permanently
 */

var logger = require('winston'),
	Router = require('./../abstract.router'),
	Constants = require('../../constants');

class VideoRemoveRoute {

	static route (req, res, next) {
		var self = this,
			id = this.models.ObjectId(req.params.id),
			body = Router.body(req);

		if (!id) return Router.notFound(res, next, req.params.id);

		if (body.permanent) {
			self.models.Video.remove({_id: id})
				.then(function () {
					Router.success(res);
					logger.info(`Video "${id}" has been permanently removed`);
					return next();
				})
				.catch(function (err) {
					logger.debug(err);
					Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
					return next();
				});
		}
		else {
			self.models.Video.findOneAndUpdate({_id: id}, {isRemoved: true})
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
}

module.exports = VideoRemoveRoute;
