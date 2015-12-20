'use strict';

'use strict';

/**
 * @api {get} /video/:id/info Get additional video information
 * @apiName GetVideoInfo
 * @apiGroup Video
 * @apiPermission USER
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Inforamtion includes: data about teams, casters, tournaments,
 * stages and formats that suggested but not in the first position
 * by rating for the current video.
 * 
 * Field will be empty array if there is no additional info for it
 *
 * @apiParam {ObjectId} id video id
 *
 * @apiSuccess {...} ... Many of them
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
    "_id": "56750584f9532ea5c2d2343d",
    "format": [
        {
            "rating": 1,
            "code": "BO5"
        }
    ],
    "stage": [],
    "teams": [
        {
            "rating": 1,
            "teams": [
                {
                    "_id": "5662e5eb457e55220b39ad0f",
                    "name": "Team Dignitas",
                    "author": "564b00fe5d63f20f4444e4b6",
                    "creationDate": "2015-12-05T13:26:03.387Z"
                },
                {
                    "_id": "565c16db71fa270789a12699",
                    "name": "Virtus Pro",
                    "author": "564b00fe5d63f20f4444e4b6",
                    "creationDate": "2015-11-30T09:28:59.416Z"
                }
            ]
        }
    ],
    "tournament": [
        {
            "_id": "56512ff1bee814c846ac372d",
            "name": "Fragbite Masters",
            "author": "564b00fe5d63f20f4444e4b6",
            "creationDate": "2015-12-20T03:57:35.608Z"
        }
    ],
    "casters": [],
    "status": "ok"
 }
 *
 * @apiUse NOT_FOUND
 */

var _flatten = require('lodash/array/flatten'),
	Router = require('./../abstract.router'),
	Constants = require('../../constants');

class VideoInfoRoute {

	static route (req, res, next, auth) {

		var self = this,
			id = self.models.ObjectId(req.params.id),
			fields = ['casters', 'tournament', 'teams', 'stage', 'format'],
			video;

		if (!id) return Router.notFound(res, next, req.params.id);

		self.models.Video.findOne({_id: id}, fields.join(' '))
			.then(function (_video) {
				video = _video;
				
				if (!video) {
					Router.fail(res, {message: Constants.ERROR_NOT_FOUND}, 404);
					return next();
				}
				
				var tournamentIds = [],
					teamIds = [],
					casterIds = [],
					promises = [];
					
				// Exclude top rated indo	
				video.tournament.splice(0, 1);
				video.casters.splice(0, 1);
				video.teams.splice(0, 1);
					
				if (video.tournament.length) {
					for (let i = 0; i < video.tournament.length; i++) tournamentIds.push(video.tournament[i]._id);
					promises.push(self.models.Tournament.getList({_id: {'$in': tournamentIds}}));
				}
				else video.tournament = [];
				
				if (video.casters.length) {
					for (let i = 0; i < video.casters.length; i++) casterIds = casterIds.concat(video.casters[i].casters);
					promises.push(self.models.Caster.getList({_id: {'$in': casterIds}}));
				}
				else video.casters = [];
				
				if (video.teams.length) {
					for (let i = 0; i < video.teams.length; i++) teamIds = teamIds.concat(video.teams[i].teams);
					promises.push(self.models.Team.getList({_id: {'$in': teamIds}}));
				}
				else video.teams = [];
				
				if (auth && auth.id) {
					promises.push(self.models.User.findOne({_id: auth.id}, 'votes'));
				}

				return Promise.all(promises);
			})
			.then(function (data) {
				var lookup = {};
				_flatten(data).forEach(i => lookup[i._id] = i);
				
				video = video.toObject(); // Convert because tournament is Array in scheme

				// TODO: stage and format

				if (video.tournament.length) {
					for (let i = 0; i < video.tournament.length; i++) {
						let rating = video.tournament[i].rating;
						video.tournament[i] = lookup[video.tournament[i]._id];
						video.tournament[i].rating = rating;
					}
				}
				
				if (video.teams.length) {
					for (let i = 0; i < video.teams.length; i++) {
						video.teams[i] = {
							rating: video.teams[i].rating,
							teams: video.teams[i].teams.map(_id => lookup[_id])
						};
					}
				}
				
				if (video.casters.length) {
					for (let i = 0; i < video.teams.length; i++) {
						video.teams[i] = {
							rating: video.teams[i].rating,
							teams: video.teams[i].teams.map(_id => lookup[_id])
						};
					}
				}
				
				Router.success(res, video);
				return next();
			})
			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}

}

module.exports = VideoInfoRoute;
