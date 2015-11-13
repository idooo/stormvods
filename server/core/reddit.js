/* global Buffer */
'use strict';

const REDDIT_UA = 'web:heroesVideos:v1.0.0 (by /u/idonreddit)';

var logger = require('winston'),
	request = require('request');

class RedditAPIClient {

	constructor (config, callbackPath) {
		this.config = config;
		this.callbackPath = callbackPath;
	}
	
	getAccessToken (code) {
		var self = this,
			r = this.config,
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
				body: `grant_type=authorization_code&code=${code}&redirect_uri=${r.callbackDomain}${self.callbackPath}`
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) resolve(JSON.parse(body));
				else reject(error);
			});
		});
	}
	
	getUserData (accessToken) {
		var r = this.config;

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
	
	generateAuthUrl (state) {
		var r = this.config,
			url = `${r.url}authorize?client_id=${r.clientId}&response_type=code&state=${state}&redirect_uri=${r.callbackDomain}${this.callbackPath}&duration=${r.duration}&scope=${r.scope}`;

		return url;
	}

}

module.exports = RedditAPIClient;
