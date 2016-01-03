'use strict';

/**
 * @api {put} /video/:id Update video
 * @apiName UpdateVideo
 * @apiGroup Video
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * You can update only one field at time
 * 
 * @apiParam {String} field Field that we will update. 
 * One of the values (tournament, stage, team, format, caster)
 *  
 * @apiParam {ObjectId} [id] id or list of ids
 * @apiParam {String} [values] values or array of values
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "ok"
 * }
 * 
 * @apiUse NOT_FOUND
 */

var logger = require('winston'),
	Router = require('./../abstract.router'),
	Video = require('../../models/video.model'),
	Constants = require('../../constants');

class UpdateVideoRoute {

	// TODO: add ability to update more than one field at time
	static route (req, res, next, auth) {
		var self = this,
			videoId = self.models.ObjectId(req.params.id),
			field = Router.filter(req.params.field),
			values = req.params.values,
			video,
			user;
		
		// Validate	
		if (!videoId) return Router.notFound(res, next, req.params.videoId);
		
		// 'video' is not allowed here
		if (Constants.ENTITY_TYPES.indexOf(field) === -1 && field !== 'video') {
			logger.info(`${Constants.ERROR_TYPE} "${field}"`);
			Router.fail(res, {message: Constants.ERROR_TYPE}, 404);
			return next();
		}
		
		// sanitise values
		if (Array.isArray(values)) values = values.map(Router.filter);
		else values = Router.filter(values);
		
		// additional validation
		// if teams - length = 2
		// if casters - length > 0
		if (field === 'teams' && values && values.length !== 2) values = null;
		else if (field === 'casters' && values && values.length === 0) values = null;
		
		if (!values) {
			Router.fail(res, {message: Constants.ERROR_INVALID});
			return next();
		}
		
		self.models.User.findOne({name: auth.name}, 'votes stats lastCreateTime')
			.then(function (_user) {
				user = _user;
				var isAllowedByTime = user.lastCreateTime.getTime() <= Date.now() + (self.config.actions || {}).delayRestriction || 1000;
				if (!isAllowedByTime) return Promise.reject({message: Constants.ERROR_TIME_RESTRICTION});

				// Search through the list of already voted entities
				var isAllowedById = user.votes[field].indexOf(videoId) === -1;
				if (!isAllowedById) return Promise.reject({message: Constants.ERROR_VOTE_TWICE});

				return self.models.Video.findOne({_id: videoId});
			})
			.then(function (_video) {
				var promises = [];
				
				video = _video;
				
				switch (field) {
					case 'tournament':
						promises.push(self.models.Tournament.getOrCreate(values, auth)); break;
					case 'teams':
						values.forEach(teamName => promises.push(self.models.Team.getOrCreate(teamName, auth))); break;
					case 'casters':
						values.forEach(casterName => promises.push(self.models.Caster.getOrCreate(casterName, auth))); break;
				}
				
				return Promise.all(promises);
			})
			.then(function (data) {
				var entityId = [],
					type;
					
				// We need to get all the entities that were created in promises above
				// data = [] only if field is code based entity
				// and then nothing were created and we can use that entity id straightaway
				if (data.length) {
					data.forEach(function (resolvedPromise) {
						entityId.push(resolvedPromise.value._id);
					});
					// only 'teams', 'casters' entities can be in array
					if (['teams', 'casters'].indexOf(field) === -1) entityId = entityId[0];
				}
				else entityId = values;
				
				// Searh if we already have that entity in video
				var isFound = Video.matchEntity(video, field, entityId);
				
				if (isFound) {
					Router.fail(res, {message: Constants.ERROR_DUPLICATE});
					return next();
				}
				
				// get type of returned entities
				// we can use 'field' but for switch below types look better
				// (data = [] only if field is code based entity)
				type = data.length ? data[0].type : field;
				
				switch (type) {
					case self.models.Tournament.modelName:
						video.tournament.push({rating: 1, _id: entityId}); break;

					case self.models.Caster.modelName:
						video.casters.push({rating: 1, casters: entityId}); break;

					case self.models.Team.modelName:
						video.teams.push({rating: 1, teams: entityId}); break;
						
					case 'format':
						video.format.push({rating: 1, code: entityId}); break;
						
					case 'stage':
						video.stage.push({rating: 1, code: entityId}); break;
				}
				
				// Save video
				video.markModified(type);
				video.save(err => {
					if (err) logger.debug(`Updating video "${video._id}" failed`, err);
				});

				user.lastCreateTime = Date.now();

				// Save video Id in the list of votes
				return new Promise(function (resolve, reject) {
					user.votes[field].push(video._id);
					user.stats.videosUpdated += 1;
					user.markModified('votes');
					user.save(function (err) {
						if (err) reject(err);
						else resolve({value: entityId});
					});
				});
			})
			.then(function (data) {
				Router.success(res, data);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = UpdateVideoRoute;
