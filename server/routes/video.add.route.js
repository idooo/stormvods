'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

class VideoAddRoute {
	
	static routeAddVideo (req, res, next, auth) {
		var self = this;

		// TODO: add author id to the details
		// TODO: check required params

		// Check params and sanitise them
		var promises = [],
			tournament = Router.filter(req.params.tournament),
			teams = [],
			casters = [],
			stage = Router.filter(req.params.stage);
			
		if (Constants.STAGES.indexOf(stage) === -1) stage = null;
			
		if (Array.isArray(req.params.teams)) {
			teams = req.params.teams.map(teamName => Router.filter(teamName));
		}
		if (Array.isArray(req.params.casters)) {
			casters = req.params.casters.map(casterName => Router.filter(casterName));
		}
		
		// Create getOrCreate promises
		promises.push(self.models.Tournament.getOrCreate(tournament, auth));
		teams.forEach(teamName => promises.push(self.models.Team.getOrCreate(teamName, auth)));
		casters.forEach(casterName => promises.push(self.models.Caster.getOrCreate(casterName, auth)));
		
		Promise.all(promises)
			.then(function (data) {
				
				var videoData = {
						youtubeId: Router.filter(req.params.youtubeId),
						author: auth.id
					},
					createdTeams = [],
					createdCasters = [];
				
				data.forEach(function (resolvedPromise) {
					if (!resolvedPromise.value) return;
					switch (resolvedPromise.type) {
						case self.models.Tournament.modelName:
							videoData.tournament = [{
								rating: 1,
								_id: resolvedPromise.value._id
							}];
							break;
							
						case self.models.Caster.modelName:
							createdCasters.push(resolvedPromise.value._id);
							break;
							
						case self.models.Team.modelName:
							createdTeams.push(resolvedPromise.value._id);
							break;
					}
				});
				
				if (createdTeams.length) {
					videoData.teams = [{
						rating: 1,
						teams: createdTeams
					}];
				}
				
				if (createdCasters.length) {
					videoData.casters = [{
						rating: 1,
						casters: createdCasters
					}];
				}
				
				if (stage) {
					videoData.stage = [{
						rating: 1,
						code: stage
					}];
				}
				
				var video = new self.models.Video(videoData);

				video.save(function (err, videoFromDB) {
					if (err) {
						logger.error(_omit(err, 'stack'));
						Router.fail(res, err);
						return next();
					}
					else {
						Router.success(res, videoFromDB);
						return next();
					}
				});

			})
			.catch(function (err) {
				Router.fail(res, {message: err}, 500);
				return next();
			});

	}
}

module.exports = VideoAddRoute;
