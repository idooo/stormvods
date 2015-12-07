'use strict';

/**
* @api {get} /api/video/validate Validate 
* @apiName ValidateVideo
* @apiGroup Video
* @apiPermission USER
* @apiVersion 1.0.0
*
* @apiDescription
* Validate the video, checking if video with that youtube id already exist.
* Fails if at least one of the following is true:
* - length != 11
* - video with that youtubeId already in the database 
*
* @apiParam {ObjectId} id youtube Id
*
* @apiSuccess {Boolean} isFound Is video with that `id` exist in the database
* @apiSuccess {ObjectId} [id] Video id in the database
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*     "isFound": true,
*     "id": "565c2776b200b02e8ea406c8",
*     "status": "ok"
* }
*
* @apiErrorExample Error-Response:
* HTTP/1.1 400 Bad Request
* {
*     "message": {
*         "id": "REQUIRED"
*     },
*     "status": "error",
*     "code": 400
* }
* @apiError INVALID_VALUE Length of youtube id != 11
* @apiError REQUIRED Parameter is required
*/

var Video = require('../../models/video.model'),
	Router = require('./../abstract.router'),
	Constants = require('../../constants');

class ValidateVideoRoute {

	static route (req, res, next) {
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

module.exports = ValidateVideoRoute;
