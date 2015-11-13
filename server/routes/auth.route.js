/* global Buffer */

/**
 * Routes
 *
 * GET /api/auth/url
 * Returns auth link for reddit
 * 
 * GET /api/auth/callback
 *
 */

'use strict';

const API_CALLBACK_PATH = '/api/auth/callback';
const API_URL_PATH = '/api/auth/url';

var uuid = require('node-uuid'),
	logger = require('winston'),
	Auth = require('../core/auth'),
	RedditAPIClient = require('../core/reddit'),
	Route = require('./abstract.route');

class AuthRoute extends Route {

	configure () {
		this.reddit = new RedditAPIClient(this.config.reddit, API_CALLBACK_PATH);

		// routes	
		this.bind(API_CALLBACK_PATH, this.routeCallback);
		this.bind(API_URL_PATH, this.routeAuthUrl);
	}

	routeAuthUrl (req, res, next) {
		var state = uuid.v4(),
			url = this.reddit.generateAuthUrl(state);

		// TODO: state should exprire
		Route.success(res, {
			url: url,
			state: state
		});
		return next();
	}

	routeCallback (req, res, next) {
		var self = this,
			userData;

		// TODO: check everything for errors
		// TODO: handle if user click deny access

		if (!req.params.code) {
			Route.fail(res, {
				message: 'No code received'
			});
			return next();
		}

		// Send request to get token
		this.reddit.getAccessToken(req.params.code)

			// Send request to get user data
			.then(function (tokenResponse) {
				return self.reddit.getUserData(tokenResponse.access_token);
			})

			// Search for user in database
			.then(function (_userData) {
				userData = _userData;
				return self.model.User.findOne({name: userData.name}, 'name');
			})
			
			// Create user if necessary
			.then(function (userDataFromDB) {
				if (userDataFromDB) Promise.resolve();
				
				var user = new self.model.User({
					name: userData.name,
					redditInfo: {
						id: userData.id,
						hasVerifiedEmail: userData.has_verified_email,
						created: userData.created_utc,
						linkKarma: userData.link_karma,
						commentKarma: userData.comment_karma
					}
				});

				user.save(function (err) {
					if (err) throw {message: 'Internal error'};
					else Promise.resolve();
				});
			})
			
			// Authorise user
			.then(function () {
				Route.success(res, Auth.authorize(userData.name));
				return next();
			})
			
			.catch(function (err) {
				Route.fail(res, err);
				return next();
			});
	}
}

module.exports = AuthRoute;
