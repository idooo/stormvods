'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');

class TournamentRouter extends AbstractEntityRouter {

	configure () {

		this.bindRoutes('tournament', this.models.Tournament);

		/**
		 * @api {get} /api/tournaments Get list of tournaments
		 * @apiName GetTournaments
		 * @apiGroup Tournament
		 * @apiVersion 1.0.0
		 */

		/**
		 * @api {post} /api/tournament Create Tournament
		 * @apiName CreateTournament
		 * @apiGroup Tournament
		 * @apiPermission USER
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {String} name
		 *
		 * @apiSuccessExample Success-Response:
		 * HTTP/1.1 200 OK
		 * {
		 *     _id: '56a723653ddc195f787e07c2',
		 *     name: 'exampleName',
		 *     status: 'ok'
		 * }
		 */

		/**
		 * @api {put} /api/tournament Update Tournament
		 * @apiName UpdateTournament
		 * @apiGroup Tournament
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiParam {ObjectId} id Tournament id
		 * @apiParam {Object} update Fields to update
		 */

		/**
		 * @api {put} /api/tournament/merge Merge Tournament
		 * @apiName MergeTournament
		 * @apiGroup Tournament
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Merge SOURCE entity into TARGET entity. System goes over
		 * all videos and replace SOURCE id by TARGET id. Deletes SOURCE entity
		 * permanently
		 *
		 * @apiParam {ObjectId} src Source entity id
		 * @apiParam {ObjectId} target Target entity id
		 */

		/**
		 * @api {delete} /api/tournament/:id Delete Tournament
		 * @apiName DeleteTournament
		 * @apiGroup Tournament
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Remove entity permanently, search through all the videos
		 * and remove entity from there
		 */
	}
}

module.exports = TournamentRouter;
