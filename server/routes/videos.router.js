'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	Router = require('./abstract.router'),
	Video = require('../models/video.model'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');

class VideoRouter extends Router {

	configure () {
		this.bindPOST('/api/video', this.routeAddVideo, {auth: true}); // TODO: REST
		this.bindGET('/api/video/validate', this.routeValidate, {auth: true});
		this.bindGET('/api/video/list', this.routeList); 
		
		// Must be the latest
		this.bindGET('/api/video/:id', this.routeGetVideo);
		this.bindDELETE('/api/video/:id', RouteFactory.generateRemoveRoute(this.models.Video), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		}); 
	}

	/**
	 * Add video
	 */ 
	routeAddVideo (req, res, next, auth) {
		var self = this;

		// TODO: add author id to the details
		// TODO: add video id to the author?
		// TODO: check required params

		var video = new self.models.Video(req.params);

		video.save(function (err, videoFromDB) {
			if (err) {
				logger.error(_omit(err, 'stack'));
				Router.fail(res, err);
				return next();
			}
			else {
				Router.success(res, videoFromDB);
				return next();
			}
		});
	}

	/**
	 * Get list of videos
	 */
	routeList (req, res, next) {
		
		// TODO: sorting and paging
		// TODO: rights for admin
		// TODO: hide deleted
		
		this.models.Video.getList()
			.then(function (datasources) {
				Router.success(res, datasources);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}

	/**
	 * Get video by {id}
	 */
	routeGetVideo (req, res, next) {
		var id = this.models.ObjectId(req.params.id);
		if (!id) return Router.notFound(res, next, req.params.id);
		
		this.models.Video.findOne({_id: id})
			.then(function (video) {
				if (!video) Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
				else Router.success(res, video);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
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
