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
		this.bindGET('/api/lookup/:type', this.routeLookup, {auth: true});
	}

	/**
	 * Lookup entity by type and query
	 * if query is valid objectId - lookup by _id full match, returns entity or 404
	 * otherwise - lookup by name partial match, returns array (empty if not found)
	 * 
	 * params:
	 * - type
	 * - query
	 */
	routeLookup (req, res, next) {
		var self = this,
			query, 
			id;
		
		// Validate params
		var modelName = LOOKUP[req.params.type];
		if (!modelName) {
			logger.warn(`Invalid lookup model name "${modelName}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE});
			return next();
		}
		// Validate params
		var queryString = LookupRouter.filter(req.params.query);
		if (queryString.length < QUERY_MIN_LENGTH) {
			Router.fail(res, {message: {'query': Constants.ERROR_INVALID}});
			return next();
		}
		
		id = self.models.ObjectId(req.params.query);
		
		if (id) query = {'_id': id};
		else query = {'name': {'$regex': `.*${queryString}.*`, '$options': 'i'}};
		
		self.models[modelName].getList(query, 'name _id')
			.then(function (values) {
				if (id) {
					if (values.length) Router.success(res, values[0].toObject());
					else Router.fail(res, {message: Constants.ERROR_NOT_FOUND});
				}
				else Router.success(res, {values});
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = LookupRouter;
