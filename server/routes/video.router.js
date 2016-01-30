'use strict';

/**
 * API documentation for video routes in routes files
 */
const API_VIDEO = '/api/video';
const API_VIDEO_REPORT = '/api/video/report';
const API_VIDEO_ID = '/api/video/:id';
const API_VIDEO_ENTITY = '/api/video/entity';
const API_VIDEO_INFO = '/api/video/:id/info';
const API_VIDEO_VALIDATE = '/api/video/validate';
const API_VIDEO_LIST = '/api/video/list';
const API_VIDEO_TOP_LIST = '/api/video/list/top';

var Constants = require('../constants'),
	Router = require('./abstract.router'),
	routes = {
		list: require('./video.routes/video.list.route'),
		topList: require('./video.routes/video.toplist.route'),
		get: require('./video.routes/video.get.route'),
		info: require('./video.routes/video.info.route'),
		add: require('./video.routes/video.add.route'),
		updateEntity: require('./video.routes/video.update.entity.route'),
		validate: require('./video.routes/video.validate.route'),
		report: require('./video.routes/video.report.route'),
		update: require('./video.routes/video.update.route'),
		remove: require('./video.routes/video.remove.route')
	};

class VideoRouter extends Router {

	configure () {
		this.bindPOST(API_VIDEO, routes.add.route, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		this.bindPOST(API_VIDEO_REPORT, routes.report.route, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		this.bindGET(API_VIDEO_VALIDATE, routes.validate.route, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		this.bindGET(API_VIDEO_LIST, routes.list.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindGET(API_VIDEO_TOP_LIST, routes.topList.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindGET(API_VIDEO_ID, routes.get.route, {
			auth: true,
			restrict: Constants.ROLES.OPTIONAL
		});

		this.bindPUT(API_VIDEO_ENTITY, routes.updateEntity.route, {
			auth: true,
			restrict: Constants.ROLES.USER
		});

		this.bindPUT(API_VIDEO, routes.update.route, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		this.bindDELETE(API_VIDEO_ID, routes.remove.route, {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		this.bindGET(API_VIDEO_INFO, routes.info.route, {
			auth: true,
			restrict: Constants.ROLES.USER
		});
	}
}

module.exports = VideoRouter;
