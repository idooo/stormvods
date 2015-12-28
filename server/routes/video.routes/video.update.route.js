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
 * @apiParam {ObjectId} [id] id or list of ids
 * @apiParam {String} [values] values 
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "ok"
 * }
 */

class UpdateVideoRoute {

	static route () {
		

	}
}

module.exports = UpdateVideoRoute;
