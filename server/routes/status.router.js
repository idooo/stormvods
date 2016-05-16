'use strict';

var logger = require('winston'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const API_STATUS_PATH = '/api/status';

class VoteRouter extends Router {

	configure () {

		/**
		* @api {head} /api/status Get status of the system
		* @apiName Vote
		* @apiGroup Vote
		* @apiPermission USER
		* @apiVersion 1.0.0
		*
		* @apiSuccessExample Success-Response:
		* HTTP/1.1 200 OK
		* {
		*     "status": "ok"
		* }
		*/
		this.bindHEAD(API_STATUS_PATH, this.routeStatus);
	}

	routeStatus (req, res, next) {
		this.models.Tops.findOne({})
			.then(() => {
				Router.success(res);
				return next();
			})
			.catch(err => {
				Router.fail(res);
				logger.info(`${Constants.ERROR_STATUS} "${err}"`);
				return next();
			});
	}
}

module.exports = VoteRouter;
