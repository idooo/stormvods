angular
	.module(`${window.APP_NAME}.common`)
	.service('Auth', authService);

const HEADER = 'Authorization';

function authService ($rootScope, $window, $http, Constants) {
	var self = this,
		authUrl = '',
		authPromise;

	self.authorise = authorise;
	self.openAuthUrl = openAuthUrl;
	self.logout = logout;
	
	function authorise () {
		var auth = $window.Auth;
		$rootScope.isAuthorised = !!auth;
		if (auth) {
			$rootScope.username = auth.username;
			$http.defaults.headers.common[HEADER] = auth.token;
		}
		else {
			getAuthUrl();
		}
	}
	
	function getAuthUrl () {
		authPromise = $http.get(Constants.Api.AUTH_GET_URL).then(response => authUrl = response.data.url);
	}
	
	function openAuthUrl () {
		if (!authUrl) authPromise.then(openAuthUrl);
		else $window.location.href = authUrl;
	}
	
	function logout () {
		deleteAllCookies();
		$window.location.assign('/');
	}
	
	function deleteAllCookies () {
		var cookies = document.cookie.split(';');

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf('=');
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	}
}
