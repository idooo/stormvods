'use strict';

var Router = require('./abstract.router'),
	ObjectId = require('mongoose').Types.ObjectId,
	logger = require('winston');

const NOT_FOUND_MESSAGE = 'Video not found'; 

class VideoRouter extends Router {

	configure () {
		this.bindPOST('/api/video/add', this.routeAdd, {auth:true});
		this.bindGET('/api/video/list', this.routeList); // TODO: Remove
		this.bindGET('/api/video/:id', this.routeVideo);
	}
	
	routeAdd (req, res, next, username) {
		var self = this;
		
		// TODO: Search for video first to prevent duplicates
		// TODO: check required params
		
		var video = new self.models.Video(req.params);

		video.save(function (err, videoFromDB) {
			if (err) {
				logger.error(err);
				Router.fail(res, err);
				return next();
			}
			else {
				Router.success(res, videoFromDB);
				return next();
			}
		});
	}
	
	routeList (req, res, next) {
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
	
	routeVideo (req, res, next) {
		var id;
		
		try {
			id = ObjectId(req.params.id); 
		}
		catch (e) {
			logger.info(`${NOT_FOUND_MESSAGE} "${req.params.id}"`)
			Router.fail(res, {message: NOT_FOUND_MESSAGE}, 404);
			return next();
		}
		
		this.models.Video.findOne({_id: id})
			.then(function (video) {
				Router.success(res, video);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, {message: NOT_FOUND_MESSAGE}, 404);
				return next();
			});
	}
}

module.exports = VideoRouter;
