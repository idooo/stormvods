'use strict';

/**
 * @api {put} /video/:id Update video
 * @apiName UpdateVideo
 * @apiGroup Video
 * @apiVersion 1.0.0
 *
 * @apiParam {String} field Field that we will update. 
 * One of the values (tournament, stage, team, format, caster)
 *  
 * @apiParam {ObjectId|ObjectId[]} [id]  
 * @apiParam {String|String[]} [values] 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "ok"
 * }
 */


var Router = require('./../abstract.router'),
	Constants = require('../../constants');

const AVAILABLE_FIELDS = ['tournament', 'stage', 'teams', 'format', 'casters'];

class UpdateVideoRoute {

	static route (req, res, next, auth) {
		

	}
}

module.exports = UpdateVideoRoute;
