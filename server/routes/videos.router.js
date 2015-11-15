'use strict';

var Router = require('./abstract.router'),
	logger = require('winston');

class VideoRouter extends Router {

	configure () {
		this.bindPOST('/api/video/add', this.routeAdd, {auth:true});
		this.bindGET('/api/video/list', this.routeList); // TODO: Remove
	}
	
	routeAdd (req, res, next, username) {
		var self = this;
		
		// TODO: Search for video first to prevent duplicates
		// TODO: check required params
		
		var video = new self.models.Video({
			url: req.params.url
		});

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
}

module.exports = VideoRouter;
