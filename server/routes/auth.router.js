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
	Router = require('./abstract.router');

class AuthRouter extends Router {

	configure () {
		this.reddit = new RedditAPIClient(this.config.reddit);

		// routes	
		this.bindGET(API_CALLBACK_PATH, this.routeCallback);
		this.bindGET(API_URL_PATH, this.routeAuthUrl);
	}

	routeAuthUrl (req, res, next) {
		var state = uuid.v4(),
			url = this.reddit.generateAuthUrl(state);

		// TODO: state should exprire
		Router.success(res, {
			url: url,
			state: state
		});
		return next();
	}

	routeCallback (req, res, next) {
		var self = this,
			userData;

		// TODO: check everything for errors

		if (req.params.error) {
			Router.fail(res, {
				message: 'Reddit auth error'
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
				return self.models.User.findOne({name: userData.name}, 'name');
			})
			
			// Create user if necessary
			.then(function (userDataFromDB) {
				if (userDataFromDB) return Promise.resolve();
				var user = new self.models.User({
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
					if (err) {
						logger.error(err);	
						throw {message: 'Internal error'};
					}
					else Promise.resolve();
				});
			})
			
			// Authorise user 
			.then(function () {
				Router.success(res, Auth.authorize(userData.name));
				return next();
			})
			
			.catch(function (err) {
				if (err.stack) {
					logger.warn(err.stack);
					if (self.config.debug && self.config.debug.showStackTrace) {
						err = {message: err.stack.toString()};
					}
				}
				
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = AuthRouter;
