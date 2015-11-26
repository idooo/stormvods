'use strict';

var logger = require('winston'),
	_omit = require('lodash/object/omit'),
	_max = require('lodash/math/max'),
	Router = require('./abstract.router'),
	Video = require('../models/video.model'),
	Constants = require('../constants'),
	RouteFactory = require('../core/route.factory');

const LIST_PAGE_SIZE = 5;

class VideoRouter extends Router {

	configure () {
		this.bindPOST('/api/video', this.routeAddVideo, {auth: true}); // TODO: REST
		this.bindGET('/api/video/validate', this.routeValidate, {auth: true});
		this.bindGET('/api/video/list', this.routeList);

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
		// TODO: add video id to the author?
		// TODO: check required params

		getTournament(req.params.tournament)
			.then(function (tournament) {
				var data = {
					youtubeId: VideoRouter.filter(req.params.youtubeId),
					author: auth.id
				};

				if (tournament) {
					data.tournament = [{
						rating: 1,
						_id: tournament._id
					}];
				}

				var video = new self.models.Video(data);

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
				Router.fail(res, err);
				return next();
			});

		/**
		 * Create tournament if it doesn't exist
		 */
		function getTournament (tournamentParam) {
			return new Promise(function (resolve, reject) {

				var tournamentName = VideoRouter.filter(tournamentParam);
				if (!tournamentName) return resolve(null);

				self.models.Tournament.findOne({name: tournamentName})
					.then(function (tournament) {
						if (tournament) return resolve(tournament);

						tournament = new self.models.Tournament({
							name: tournamentName,
							author: auth.id
						});
						tournament.save(function (err, tournamentFromDB) {
							if (err) return reject(err);
							resolve(tournamentFromDB);
						});

					});
			});
		}
	}

	/**
	 * Get list of videos
	 */
	routeList (req, res, next) {

		// TODO: add users' votes

		var self = this,
			query = {isRemoved: {'$ne': true}},
			page = parseInt(req.params.p, 10) || 1,
			fields = '-isRemoved -__v',
			videos,
			pageCount,
			itemCount;

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
	}

	/**
	 * Get video by {id}
	 */
	routeGetVideo (req, res, next) {

		// TODO: add users' votes

		var self = this,
			id = self.models.ObjectId(req.params.id),
			video;

		if (!id) return Router.notFound(res, next, req.params.id);

		self.models.Video.findOne({_id: id})
			.then(function (_video) {
				video = _video;
				if (video) {
					var topTournament = _max(video.tournament, 'rating');
					if (topTournament) {
						return self.models.Tournament.findOne({_id: topTournament._id}, 'name _id');
					}
					else Router.success(res, video);
				}
				else Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
				return next();
			})
			.then(function (tournament) {
				video = video.toObject(); // Convert because tournament is Array in scheme
				video.tournament = {
					_id: tournament._id,
					name: tournament.name,
					rating: video.tournament[0] ? video.tournament[0].rating : null
				};
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
}

module.exports = VideoRouter;
