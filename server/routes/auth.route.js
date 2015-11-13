/* global Buffer */
'use strict';

const API_CALLBACK_PATH = '/api/auth/callback';
const API_URL_PATH = '/api/auth/url';
const REDDIT_UA = 'web:heroesVideos:v1.0.0 (by /u/idonreddit)';

var uuid = require('node-uuid'),
	request = require('request'),
	logger = require('winston'),
	Route = require('./abstract.route');

class AuthRoute extends Route {

	configure () {
		this.bind(API_CALLBACK_PATH, this.routeCallback);
		this.bind(API_URL_PATH, this.routeGenerateAuthUrl);
	}

	routeGenerateAuthUrl (req, res, next) {
		var r = this.config.reddit,
			state = uuid.v4(),
			url = `${r.url}authorize?client_id=${r.clientId}&response_type=code&state=${state}&redirect_uri=${r.callbackDomain}${API_CALLBACK_PATH}&duration=${r.duration}&scope=${r.scope}`;

		Route.success(res, {
			url: url,
			state: state
		});
		return next();
	}

	routeCallback (req, res, next) {
		var self = this;

		logger.info('Auth process started');

		// TODO: check everything for errors

		if (!req.params.code) {
			Route.fail(res, {
				message: 'No code received'
			});
			return next();
		}

		this.getAccessToken(req.params.code)
			.then(function (tokenResponse) {
				return self.getUserData(tokenResponse.access_token);
			})
			.then(function (userData) {
				logger.info('Auth process finished');

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
				user.save(function (err, userInfo) {
					if (err) throw {message: 'Internal error'};
					else {
						Route.success(res, userInfo);
						return next();
					}
				});
			})
			.catch(function (err) {
				Route.fail(res, err);
				return next();
			});
	}

	getAccessToken (code) {
		var r = this.config.reddit,
			auth = 'Basic ' + new Buffer(`${r.clientId}:${r.secret}`).toString('base64');

		return new Promise((resolve, reject) => {
			logger.debug(`Sending request to ${r.url}access_token`);
			request({
				url: `${r.url}access_token`,
				method: 'POST',
				headers : {
					'Authorization': auth,
					'User-Agent': REDDIT_UA
				},
				body: `grant_type=authorization_code&code=${code}&redirect_uri=${r.callbackDomain}${API_CALLBACK_PATH}`
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) resolve(JSON.parse(body));
				else reject(error);
			});
		});
	}

	getUserData (accessToken) {
		var r = this.config.reddit;

		return new Promise((resolve, reject) => {
			logger.debug(`Sending request to ${r.oauthUrl}me`);
			request({
				url: `${r.oauthUrl}me`,
				method: 'GET',
				headers : {
					'Authorization': `bearer ${accessToken}`,
					'User-Agent': REDDIT_UA
				}
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) resolve(JSON.parse(body));
				else reject(error);
			});
		});
	}

}

module.exports = AuthRoute;
