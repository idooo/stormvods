'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');

class TournamentRouter extends AbstractEntityRouter {

	configure () {

		this.bindRoutes('tournament', this.models.Tournament);

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
		 * @api {delete} /api/tournament/:id Delete Tournament
		 * @apiName DeleteTournament
		 * @apiGroup Tournament
		 * @apiPermission ADMIN
		 * @apiVersion 1.0.0
		 */

		/**
		 * @api {get} /api/tournaments Get list of tournaments
		 * @apiName GetTournaments
		 * @apiGroup Tournament
		 * @apiVersion 1.0.0
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

        //
		///**
		// * @api {get} /api/tournament/:id Get tournament
		// * @apiName GetTournament
		// * @apiGroup Tournament
		// * @apiPermission ADMIN
		// * @apiVersion 1.0.0
		// */
		//this.bindGET('/api/tournaments/:id', RouteFactory.generateGetListRoute(this.models.Tournament), {
		//	auth: true,
		//	restrict: Constants.ROLES.ADMIN
		//});
	}
}

module.exports = TournamentRouter;
