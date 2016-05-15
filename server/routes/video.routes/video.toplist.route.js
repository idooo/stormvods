'use strict';

/**
 * @api {get} /video/list/top Get the top rated list of videos
 * @apiName GetVideoTopList
 * @apiGroup Video
 * @apiVersion 1.0.0
 *
 * @apiParam {String} [mode] Top mode (today, week (default), month, alltime)
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * Identical to /video/list
 */

var Router = require('./../abstract.router'),
	VideoListRoute = require('./video.list.route.js'),
	Constants = require('../../constants');

const DEFAULT_TOP_MODE = 'DAY7';

class VideoTopListRoute extends VideoListRoute {

	static route (req, res, next, auth) {

		var self = this,
			query = {isRemoved: {'$ne': true}},
			mode = DEFAULT_TOP_MODE,
			fields = '-isRemoved -__v';

		if (Object.keys(Constants.TOP_MODES).indexOf(req.params.mode) !== -1) {
			mode = Constants.TOP_MODES[req.params.mode];
		}

		self.models.Tops.findOne({}, mode)
			.then(function (data) {
				query._id = {'$in': data[mode]};
				return self.models.Video.find(query, fields, {rating: -1});
			})
			.then(function (data) {
				return VideoTopListRoute.mapReduce.call(self, data, auth);
			})
			.then(function (data) {
				data.videos = data.videos.sort((x, y) => y.rating - x.rating);
				Router.success(res, data);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});

	}
}

module.exports = VideoTopListRoute;
