'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_max = require('lodash/math/max'),
	Router = require('./abstract.router'),
	Video = require('../models/video.model'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');

const LIST_PAGE_SIZE = 10;
const VIEW_MODES = {
	DEFAULT: 'DEFAULT',
	ONLY_REMOVED: 'ONLY_REMOVED',
	ALL: 'ALL'
};

class VideoRouter extends Router {

	configure () {
		this.bindPOST('/api/video', this.routeAddVideo, {auth: true}); 
		
		this.bindGET('/api/video/validate', this.routeValidate, {auth: true});
		this.bindGET('/api/video/list', this.generateVideoListRoute(VIEW_MODES.DEFAULT));
		this.bindGET('/api/video/removed', this.generateVideoListRoute(VIEW_MODES.ONLY_REMOVED), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});

		// Must be the latest
		this.bindGET('/api/video/:id', this.routeGetVideo);
		this.bindDELETE('/api/video/:id', RouteFactory.generateRemoveRoute(this.models.Video), {
			auth: true,
			restrict: Constants.ROLES.ADMIN
		});
	}

	/**
	 * Add video
	 */
	routeAddVideo (req, res, next, auth) {
		var self = this;

		// TODO: add author id to the details
		// TODO: check required params

		console.log(req.params)
		
		// Check params and sanitise them
		var promises = [],
			tournament = VideoRouter.filter(req.params.tournament),
			teams = [],
			casters = [],
			stage = VideoRouter.filter(req.params.stage);
			
		if (Constants.STAGES.indexOf(stage) === -1) stage = null;
			
		if (Array.isArray(req.params.teams)) {
			teams = req.params.teams.map(teamName => VideoRouter.filter(teamName));
		}
		if (Array.isArray(req.params.casters)) {
			casters = req.params.casters.map(casterName => VideoRouter.filter(casterName));
		}
		
		// Create getOrCreate promises
		promises.push(self.models.Tournament.getOrCreate(tournament, auth));
		teams.forEach(teamName => promises.push(self.models.Team.getOrCreate(teamName, auth)));
		casters.forEach(casterName => promises.push(self.models.Caster.getOrCreate(casterName, auth)));
		
		Promise.all(promises)
			.then(function (data) {
				
				var videoData = {
						youtubeId: VideoRouter.filter(req.params.youtubeId),
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

		/**
		 * Create tournament if it doesn't exist
		 */
		
	}

	/**
	 * Get video by {id}
	 */
	routeGetVideo (req, res, next) {

		// TODO: add users' votes

		var self = this,
			id = self.models.ObjectId(req.params.id),
			promisesNames = [], // We need array to store promises order
			video;

		if (!id) return Router.notFound(res, next, req.params.id);

		self.models.Video.findOne({_id: id})
			.then(function (_video) {
				video = _video;
				if (video) {
					var topTournament = _max(video.tournament, 'rating'),
						topTeams = _max(video.teams, 'rating'),
						topCasters = _max(video.casters, 'rating'),
						promises = [];
					
					if (topTournament) {
						promises.push(self.models.Tournament.findOne({_id: topTournament._id}, 'name _id'));
						promisesNames.push(self.models.Tournament.modelName);
					}
					if (topTeams) {
						promises.push(self.models.Team.getList({_id: {'$in': topTeams.teams}}, 'name _id'));
						promisesNames.push(self.models.Team.modelName);
					}
					if (topCasters) {
						promises.push(self.models.Caster.getList({_id: {'$in': topCasters.casters}}, 'name _id'));
						promisesNames.push(self.models.Caster.modelName);
					}
					
					return Promise.all(promises); 
				}
				else Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
				return next();
			})
			.then(function (data) {
				var topStage = _max(video.stage, 'rating');
				
				video = video.toObject(); // Convert because tournament is Array in scheme
				
				promisesNames.forEach(function (modelName, i) {
					if (!data[i] || Array.isArray(data[i] && !data[i].length)) return;
					
					switch (modelName) {
						case self.models.Tournament.modelName:
							video.tournament = {
								_id: data[i]._id,
								name: data[i].name,
								rating: video.tournament[0] ? video.tournament[0].rating : null
							};
							break;
							
						case self.models.Caster.modelName:
							video.casters = [{
								casters: data[i],
								rating: video.casters[0] ? video.casters[0].rating : null
							}];
							break;
							
						case self.models.Team.modelName:
							video.teams = [{
								teams: data[i],
								rating: video.teams[0] ? video.teams[0].rating : null
							}];
							break;
					}
				});
				
				if (topStage) video.stage = topStage;
				
				Router.success(res, video);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}

	/**
	 * Validate video by youtubeId {id}
	 * Fails if at leas one of the following is true:
	 * - length != 11
	 * - video with that youtubeId already in the database (returns id)
	 */
	routeValidate (req, res, next) {
		var error;

		if (!req.params.id) error = Constants.ERROR_REQUIRED;
		else if (req.params.id.length !== Video.constants().YOUTUBE_ID_LENGTH) error = Constants.ERROR_INVALID;

		if (error) {
			Router.fail(res, {message: {id: error}});
			return next();
		}

		this.models.Video.findOne({youtubeId: req.params.id}, '_id')
			.then(function (video) {
				var data = {isFound: !!(video)};
				if (data.isFound) data.id = video._id;
				Router.success(res, data);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
	
	/**
	 * 
	 */
	generateVideoListRoute (viewMode) {
		
		// TODO: add users' votes
		
		return function (req, res, next) {

			var self = this,
				query = {},
				page = parseInt(req.params.p, 10) || 1,
				fields = '-isRemoved -__v',
				videos,
				pageCount,
				itemCount;
				
			if (viewMode === VIEW_MODES.DEFAULT) query = {isRemoved: {'$ne': true}};
			else if (viewMode === VIEW_MODES.ONLY_REMOVED) query = {isRemoved: {'$ne': false}};
	
			self.models.Video.paginate(query, {
				page: page,
				limit: LIST_PAGE_SIZE,
				columns: fields
			})
				.spread(function (_videos, _pageCount, _itemCount) {
					var tournamentIds = [];
	
					pageCount = _pageCount;
					itemCount = _itemCount;
	
					videos = _videos.map(function (video) {
						video = video.toObject(); // Convert because tournament is Array in scheme
						video.tournament = _max(video.tournament, 'rating');
	
						// in case we have no rating, _max will return -Infinity so we will handle that
						if (typeof video.tournament === 'number') video.tournament = {};
	
						tournamentIds.push(video.tournament._id);
						return video;
					});
					return self.models.Tournament.getList({_id: {'$in': tournamentIds}});
				})
				.then(function (tournaments) {
					var tournamentsHash = {};
					for (var i = 0; i < tournaments.length; i++) {
						tournamentsHash[tournaments[i]._id.toString()] = tournaments[i];
					}
	
					for (i = 0; i < videos.length; i++) {
						if (videos[i].tournament) {
							var tournament = tournamentsHash[videos[i].tournament._id];
							videos[i].tournament.name = tournament ? tournament.name : null;
						}
					}
					Router.success(res, {videos, pageCount, itemCount});
					return next();
				})
				.catch(function (err) {
					Router.fail(res, err);
					return next();
				});
		};
	}
}

module.exports = VideoRouter;
