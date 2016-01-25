'use strict';

/**
 * @api {post} /video/report Report video
 * @apiName ReportVideo
 * @apiGroup Video
 * @apiPermission USER
 * @apiVersion 1.0.0
 *
 * @apiParam {ObjectId} id video id
 *
 * @apiUse NOT_FOUND
 */

var Router = require('./../abstract.router'),
	Constants = require('../../constants');

class VideoReportRoute {

	static route (req, res, next, auth) {
		var self = this,
			id = self.models.ObjectId(req.params.id);

		if (!id) return Router.notFound(res, next, req.params.id);

		self.models.Video.findOne({_id: id, isRemoved: {'$ne': true}}, 'reports')
			.then(function (video) {
				if (!video) return Router.notFound(res, next, req.params.id);

				for (let i = 0; i < video.reports.length; i++) {
					if (video.reports[i].equals(auth.id)) {
						return Router.fail(res, {message: Constants.ERROR_VOTE_TWICE});
					}
				}

				video.reports.push(auth.id);
				video.markModified('reports');
				video.save();

				Router.success(res);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = VideoReportRoute;
