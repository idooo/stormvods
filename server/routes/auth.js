/* global Buffer */
'use strict';

const CALLBACK_PATH = '/api/auth/callback';
const REDDIT_UA = 'web:heroesVideos:v1.0.0 (by /u/idonreddit)';

var uuid = require('node-uuid'),
	request = require('request'),
	logger = require('winston'),
	Route = require('./abstract.route');

class AuthRoute extends Route {

	configure () {
		this.server.get(CALLBACK_PATH, this.routeCallback.bind(this));
		this.server.get('/api/auth/url', this.routeGenerateAuthUrl.bind(this));
	}
	routeGenerateAuthUrl (req, res, next) {
		var r = this.config.reddit,
			code = uuid.v4(),
			url = `${r.url}authorize?client_id=${r.clientId}&response_type=code&state=${code}&redirect_uri=${r.callbackDomain}${CALLBACK_PATH}&duration=${r.duration}&scope=${r.scope}`;
			
		Route.success(res, {
			url: url
		});
		return next();
	}
	routeCallback (req, res, next) {
		var self = this;
		
		logger.info(`${self.name}: auth process started`);
		
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
				logger.info(`${self.name}: auth process finished`);
				Route.success(res, userData);
				return next();
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
			logger.debug(`${this.name}: sending request to ${r.url}access_token`);
			request({
				url: `${r.url}access_token`,
				method: 'POST',
				headers : {
					'Authorization': auth,
					'User-Agent': REDDIT_UA
				},
				body: `grant_type=authorization_code&code=${code}&redirect_uri=${r.callbackDomain}${CALLBACK_PATH}`
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) resolve(JSON.parse(body));
				else reject(error);
			});
		});
	}
	getUserData (accessToken) {
		var r = this.config.reddit;
		
		return new Promise((resolve, reject) => {
			logger.debug(`${this.name}: sending request to ${r.oauthUrl}me`);
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