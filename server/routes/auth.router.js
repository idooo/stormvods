'use strict';

const API_CALLBACK_PATH = '/api/auth/callback';
const API_URL_PATH = '/api/auth/url';

var uuid = require('node-uuid'),
	Auth = require('../core/auth'),
	RedditAPIClient = require('../core/reddit'),
	Router = require('./abstract.router'),
	Constants = require('../constants');

class AuthRouter extends Router {

	configure () {
		this.reddit = new RedditAPIClient(this.config.reddit);

		/**
		* @api {get} /api/auth/callback Callback endpoint for Reddit Auth
		* @apiName AuthCallback
		* @apiGroup Auth
		* @apiVersion 1.0.0
		*/
		this.bindGET(API_CALLBACK_PATH, this.routeCallback);

		/**
		* @api {get} /api/auth/url Create Auth URL
		* @apiName AuthUrl
		* @apiGroup Auth
		* @apiVersion 1.0.0
		*/
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

		if (req.params.error) {
			Router.fail(res, {message: Constants.ERROR_REDDIT_AUTH});
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
				return self.models.User.findOne({name: userData.name}, 'name role');
			})

			// Create user if necessary
			.then(function (userDataFromDB) {
				if (userDataFromDB) return Promise.resolve(userDataFromDB);
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

				return user.save();
			})

			// Authorise user
			.then(function (userDataFromDB) {
				var auth = Auth.authorize(userDataFromDB._id, userDataFromDB.name, userDataFromDB.role);

				res.setCookie('username', auth.username, {path: '/'});
				res.setCookie('token', auth.token, {path: '/'});
				res.setCookie('role', auth.role, {path: '/'});

				Router.success(res, auth);
				return next();
			})

			.catch(function (err) {
				Router.fail(res, err);
				return next();
			});
	}
}

module.exports = AuthRouter;
