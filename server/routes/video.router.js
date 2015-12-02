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
		this.bindPOST('/api/video', VideoAddRoute.routeAddVideo, {auth: true}); 
		
		this.bindGET('/api/video/validate', this.routeValidate, {auth: true});
		this.bindGET('/api/video/list', VideoListRoute.generateVideoListRoute(Constants.VIEW_MODES.DEFAULT));
		this.bindGET('/api/video/removed', VideoListRoute.generateVideoListRoute(Constants.VIEW_MODES.ONLY_REMOVED), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		// Must be the latest
		this.bindGET('/api/video/:id', VideoGetRoute.routeGetVideo);
		this.bindDELETE('/api/video/:id', RouteFactory.generateRemoveRoute(this.models.Video), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	/**
	 * Validate video by youtubeId {id}
	 * Fails if at leas one of the following is true:
	 * - length != 11
	 * - video with that youtubeId already in the database (returns id)
	 */
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
