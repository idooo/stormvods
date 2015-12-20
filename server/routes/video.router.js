'use strict';

/**
 * API documentation for video routes in routes files
 */
const API_VIDEO = '/api/video';
const API_VIDEO_ID = '/api/video/:id';
const API_VIDEO_INFO = '/api/video/:id/info';
const API_VIDEO_VALIDATE = '/api/video/validate';
const API_VIDEO_LIST = '/api/video/list';
const API_VIDEO_TOPLIST = '/api/video/list/top';
const API_VIDEO_REMOVED = '/api/video/removed';

var Constants = require('../constants'),
	Router = require('./abstract.router'),
	RouteFactory = require('../core/route.factory'),
	VideoListRoute = require('./video.routes/video.list.route'),
	VideoTopListRoute = require('./video.routes/video.toplist.route'),
	VideoGetRoute = require('./video.routes/video.get.route'),
	VideoInfoRoute = require('./video.routes/video.info.route'),
	VideoAddRoute = require('./video.routes/video.add.route'),
	ValidateVideoRoute = require('./video.routes/video.validate.route');


class VideoRouter extends Router {

	configure () {
		this.bindPOST(API_VIDEO, VideoAddRoute.route, {auth: true});
		
		this.bindGET(API_VIDEO_VALIDATE, ValidateVideoRoute.route, {auth: true});
		
		this.bindGET(API_VIDEO_LIST, new VideoListRoute(Constants.VIEW_MODES.DEFAULT).route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});
		
		this.bindGET(API_VIDEO_TOPLIST, new VideoTopListRoute(Constants.VIEW_MODES.DEFAULT).route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});
		
		this.bindGET(API_VIDEO_REMOVED, new VideoListRoute(Constants.VIEW_MODES.ONLY_REMOVED).route, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		// Must be the latest
		this.bindGET(API_VIDEO_ID, VideoGetRoute.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});
		
		this.bindGET(API_VIDEO_INFO, VideoInfoRoute.route, {auth: true});
		
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
		this.bindDELETE(API_VIDEO_ID, RouteFactory.generateRemoveRoute(this.models.Video), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}
}

module.exports = VideoRouter;
