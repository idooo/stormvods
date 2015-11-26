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

	routeLookup (req, res, next) {
		var self = this;

		// Validate params
		var modelName = LOOKUP[req.params.type];
		if (!modelName) {
			if (!self.models[modelName]) {
				logger.warn(`Invalid model name "${modelName}" - shouldn't happen!`);
				Router.fail(res, {message: Constants.ERROR_INTERNAL}, 500);
			}
			else Router.fail(res, {message: Constants.ERROR_TYPE});
			return next();
		}
		// Validate params
		var query = LookupRouter.filter(req.params.query);
		if (query.length < QUERY_MIN_LENGTH) {
			Router.fail(res, {message: {'query': Constants.ERROR_INVALID}});
			return next();
		}

		this.models[modelName].getList({'name': {'$regex': `.*${query}.*`, '$options': 'i'}}, 'name _id')
			.then(function (values) {
				Router.success(res, {values});
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = LookupRouter;
