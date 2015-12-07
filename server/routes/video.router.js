// API Documentation for create video in a separate file
const API_VIDEO = '/api/video';

/**
 * @api {delete} /video/:id Deletes video
 * @apiName DeleteVideo
 * @apiGroup Video
 * @apiPermission ADMIN
 *
 * @apiParam {ObjectId} id video id
 * @apiParam {Boolean} [permanent] removes record from db permanently
 */

// API Documentation for deleting video in a separate file
const API_VIDEO_ID = '/api/video/:id';

/**
 * @api {get} /video/validate Validate video
 * @apiName ValidateVideo
 * @apiGroup Video
 *
 * @apiDescription
 * Validate the video, checking if video with that youtube id already exist.
 * Fails if at leas one of the following is true:
 * - length != 11
 * - video with that youtubeId already in the database (returns id)
 *
 * @apiParam {ObjectId} id youtube Id
 */

const API_VIDEO_VALIDATE = '/api/video/validate';

// API Documentation for get list of videos in a separate file
const API_VIDEO_LIST = '/api/video/list';

// API Documentation for get list of removed videos in a separate file
const API_VIDEO_REMOVED = '/api/video/removed';

'use strict';

var Router = require('./abstract.router'),
	Video = require('../models/video.model'),
	Constants = require('../constants'),

	RouteFactory = require('../core/route.factory'),
	VideoListRoute = require('./video.list.route'),
	VideoGetRoute = require('./video.get.route'),
	VideoAddRoute = require('./video.add.route');


class VideoRouter extends Router {

	configure () {
		this.bindPOST(API_VIDEO, VideoAddRoute.routeAddVideo, {auth: true});

		this.bindGET(API_VIDEO_VALIDATE, this.routeValidate, {auth: true});
		this.bindGET(API_VIDEO_LIST, VideoListRoute.generateVideoListRoute(Constants.VIEW_MODES.DEFAULT));
		this.bindGET(API_VIDEO_REMOVED, VideoListRoute.generateVideoListRoute(Constants.VIEW_MODES.ONLY_REMOVED), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		// Must be the latest
		this.bindGET(API_VIDEO_ID, VideoGetRoute.routeGetVideo);
		this.bindDELETE(API_VIDEO_ID, RouteFactory.generateRemoveRoute(this.models.Video), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	routeValidate (req, res, next) {
		var error;

		if (!req.params.id) error = Constants.ERROR_REQUIRED;
		else if (req.params.id.length !== Video.constants().YOUTUBE_ID_LENGTH) error = Constants.ERROR_INVALID;

		if (error) {
			Router.fail(res, {message: {id: error}});
			return next();
		}

		this.models.Video.findOne({youtubeId: req.params.id}, '_id')
			.then(function (video) {
				var data = {isFound: !!(video)};
				if (data.isFound) data.id = video._id;
				Router.success(res, data);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}

}

module.exports = VideoRouter;
