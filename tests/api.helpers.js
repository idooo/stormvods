var request = require('sync-request');

module.exports = helper();

function helper () {

	return {
		get: function (path, params) {
			return getContent('GET', path, params);
		},

		post: function (path, params) {
			return getContent('POST', path, params);
		},

		put: function (path, params) {
			return getContent('PUT', path, params);
		},

		delete: function (path, params) {
			return getContent('DELETE', path, params);
		}
	};

	function getContent (method, path, params) {
		var url = 'http://localhost:7777' + path;
		var res = request(method, url, {
			headers: {
				'Content-Type': 'application/json'
			},
			json: params
		});
		if (res.statusCode === 200) {
			return JSON.parse(res.getBody().toString());
		}
		return JSON.parse(res.body.toString());
	}
}
