angular
	.module(`${window.APP_NAME}.common`)
	.service('Auth', authService);

const HEADER = 'Authorization';

function authService ($rootScope, $window, $http, Constants, CookieHelper) {
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
			$rootScope.role = auth.role;
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
		CookieHelper.deleteAllCookies();
		$window.location.assign('/');
	}
}
