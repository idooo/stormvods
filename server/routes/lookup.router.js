'use strict';

var logger = require('winston'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

const QUERY_MIN_LENGTH = 3;
// type param => Model mappings
const LOOKUP = {
	tournament: 'Tournament',
	caster: 'Caster',
	team: 'Team',
	stage: 'Stage'
};

class LookupRouter extends Router {

	configure () {

		/**
		 * @api {get} /api/lookup/:type Search for entity
		 * @apiName Lookup
		 * @apiGroup Lookup
		 * @apiPermission USER
		 * @apiVersion 1.0.0
		 *
		 * @apiDescription
		 * Lookup entity by type and query. If `id` is passed objectId - lookup by _id full match.
		 * Otherwise - lookup by name partial match, returns array (empty if not found)
		 *
		 * @apiParam {String="tournament","team","caster"} type
		 * @apiParam {String} [query] Min length is 3
		 * @apiParam {ObjectId} [id] lookup by _id full match
		 *
		 * @apiSuccessExample Success-Response:
		 * HTTP/1.1 200 OK
		 * {
		 *     "values": [
		 *         {
		 *             "_id": "565c2775b200b02e8ea406c5",
		 *             "name": "Tempo Storm"
		 *         },
		 *         ...
		 *     ],
		 *     "status": "ok"
		 * }
		 *
		 * @apiSuccessExample Not Found Response:
		 * HTTP/1.1 200 OK
		 * {
		 *     "values": [],
		 *     "status": "ok"
		 * }
		 *
		 * @apiErrorExample Error-Response:
		 * HTTP/1.1 400 Bad Request
		 * {
		 *     "message": {
		 *         "query": "INVALID_VALUE"
		 *     },
		 *     "status": "error",
		 *     "code": 400
		 * }
		 *
		 * @apiUse INVALID_VALUE
		 * @apiUse WRONG_TYPE
		 */
		this.bindGET('/api/lookup/:type', this.routeLookup);
	}

	routeLookup (req, res, next) {
		var self = this,
			query,
			queryString = LookupRouter.filter(req.params.query),
			id = LookupRouter.filter(req.params.id),
			modelName = LOOKUP[req.params.type];

		// Validate params
		if (!modelName) {
			logger.warn(`Invalid lookup model name "${modelName}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE});
			return next();
		}

		// Validate params
		if (queryString && queryString.length >= QUERY_MIN_LENGTH) {
			let regexp = queryString.replace('(', '\\(').replace(')', '\\)');
			query = {name: {'$regex': `.*${regexp}.*`, '$options': 'i'}};
		}
		else if (id) {
			id = self.models.ObjectId(id);
			if (!id) {
				Router.fail(res, {message: {id: Constants.ERROR_INVALID}});
				return next();
			}
			query = {'_id': id};
		}
		else {
			Router.fail(res, {message: {query: Constants.ERROR_INVALID}});
			return next();
		}

		query.isRemoved = {'$ne': true};

		self.models[modelName].find(query, 'name _id')
			.then(function (values) {
				var result = [];

				if (id && values.length) result.push(values[0].toObject());
				else result = values;

				Router.success(res, {values: result});
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = LookupRouter;
