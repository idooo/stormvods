'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	Router = require('./abstract.router'),
	Video = require('../models/video.model'),
	Constants = require('../constants');

class VideoRouter extends Router {

	configure () {
		this.bindPOST('/api/video', this.routeAdd, {auth:true}); // TODO: REST
		this.bindGET('/api/video/list', this.routeList); // TODO: Remove
		this.bindGET('/api/video/validate', this.routeValidate);
		
		// Must be the latest
		this.bindGET('/api/video/:id', this.routeVideo);
		this.bindDELETE('/api/video/:id', this.routeDelete, {auth:true}); 
	}

	/**
	 * Add video
	 */ 
	routeAdd (req, res, next, auth) {
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
	routeVideo (req, res, next) {
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
	 * Remove video by {id}
	 * Body:
	 * - permanent {Boolean} [optional] removes record from db permanently
	 */
	routeDelete (req, res, next) {
		var self = this,
			id = this.models.ObjectId(req.params.id),
			body = Router.body(req);
			
		if (!id) return VideoRouter.notFound(res, next, req.params.id);
		
		if (body.permanent) {
			this.models.Video.removeOne({_id: id})
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
			self.models.Video.findOne({_id: id}, 'isRemoved')
				.then(function (video) {
					if (video) {
						if (!video.isRemoved) return video.markAsRemoved();
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
