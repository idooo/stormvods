'use strict';

var AbstractEntityRouter = require('./abstract.entity.router');
var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_pick = require('lodash/object/pick'),
	Router = require('./abstract.router');

const MIN_YEAR = 2015;

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


	/**
	 * @api {post} /api/tournament Create Tournament
	 * @apiName CreateTournament
	 * @apiGroup Tournament
	 * @apiPermission USER
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} name
	 * @apiParam {Number} month (1..12)
	 * @apiParam {Number} year (2015..)
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 *     _id: '56a723653ddc195f787e07c2',
	 *     name: 'exampleName',
	 *     status: 'ok'
	 * }
	 */
	addRoute (req, res, next, auth) {
		// Validate params
		var name = Router.filter(req.params.name),
			date = TournamentRouter.validateTournamentDate(
				Router.filter(req.params.month),
				Router.filter(req.params.year));

		var modelInstance = this.model({
			name,
			author: auth.id,
			dateMonth: date.month,
			dateYear: date.year
		});

		modelInstance.save(function (err, responseFromDB) {
			if (err) {
				logger.debug(_omit(err, 'stack'));
				Router.fail(res, err);
				return next();
			}
			else {
				Router.success(res, _pick(responseFromDB, ['_id', 'name']));
				return next();
			}
		});
	}

	/**
	 * @param rawMonth
	 * @param rawYear
	 * @returns {{year: (Number|number), month: (Number|number)}}
     */
	static validateTournamentDate (rawMonth, rawYear) {
		let now = new Date(),
			month = parseInt(rawMonth, 10) || now.getMonth() + 1,
			year = parseInt(rawYear, 10) || now.getFullYear();

		if (month < 1 || month > 12) month = now.getMonth() + 1;
		if (MIN_YEAR > year || year > now.getFullYear()) year = now.getFullYear();
		if (year === now.getFullYear() && month > now.getMonth() + 1) month = now.getMonth() + 1;

		return {year, month};
	}
}

module.exports = TournamentRouter;
