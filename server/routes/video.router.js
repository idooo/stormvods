'use strict';

/**
 * API documentation for video routes in routes files
 */
const API_VIDEO = '/api/video';
const API_VIDEO_ID = '/api/video/:id';
const API_VIDEO_ENTITY = '/api/video/entity';
const API_VIDEO_INFO = '/api/video/:id/info';
const API_VIDEO_VALIDATE = '/api/video/validate';
const API_VIDEO_LIST = '/api/video/list';
const API_VIDEO_TOPLIST = '/api/video/list/top';

var Constants = require('../constants'),
	Router = require('./abstract.router'),
	RouteFactory = require('../core/route.factory'),
	VideoListRoute = require('./video.routes/video.list.route'),
	VideoTopListRoute = require('./video.routes/video.toplist.route'),
	VideoGetRoute = require('./video.routes/video.get.route'),
	VideoInfoRoute = require('./video.routes/video.info.route'),
	VideoAddRoute = require('./video.routes/video.add.route'),
	VideoUpdateRouteEntity = require('./video.routes/video.update.entity.route'),
	ValidateVideoRoute = require('./video.routes/video.validate.route');


class VideoRouter extends Router {

	configure () {
		this.bindPOST(API_VIDEO, VideoAddRoute.route, {auth: true});

		this.bindGET(API_VIDEO_VALIDATE, ValidateVideoRoute.route, {auth: true});

		this.bindGET(API_VIDEO_LIST, VideoListRoute.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindGET(API_VIDEO_TOPLIST, VideoTopListRoute.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindGET(API_VIDEO_ID, VideoGetRoute.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindPUT(API_VIDEO_ENTITY, VideoUpdateRouteEntity.route, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

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
		this.bindPUT(API_VIDEO, RouteFactory.generateUpdateRoute(this.models.Video), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

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

		this.bindGET(API_VIDEO_INFO, VideoInfoRoute.route, {auth: true});
	}
}

module.exports = VideoRouter;
