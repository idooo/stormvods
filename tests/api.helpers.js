var request = require('sync-request');

module.exports = helper();

function helper () {

	return {
		get: function (path, params, user) {
			return getContent('GET', path, params, setXDebugHeader(user));
		},

		post: function (path, params, user) {
			return getContent('POST', path, params, setXDebugHeader(user));
		},

		put: function (path, params, user) {
			return getContent('PUT', path, params, setXDebugHeader(user));
		},

		delete: function (path, params, user) {
			return getContent('DELETE', path, params, setXDebugHeader(user));
		},
		
		addUser: function (name, role) {
			return getContent('POST', '/api/user', {name, role}, {
				'X-Debug-User-Id': 'whatever',
				'X-Debug-User-Role': '10'
			});
		}
	};

	function getContent (method, path, params, headers) {
		var url = 'http://localhost:7777' + path,
			options = {
				headers: headers || {},
				json: params
			};
			
		options.headers['Content-Type'] = 'application/json';
		
		var res = request(method, url, options);
		if (res.statusCode === 200) {
			return JSON.parse(res.getBody().toString());
		}
		return JSON.parse(res.body.toString());
	}
	
	function setXDebugHeader (user) {
		if (!user) return {};
		return {
			'X-Debug-User-Id': user._id,
			'X-Debug-User-Name': user.name,
			'X-Debug-User-Role': user.role
		};
	}
}
