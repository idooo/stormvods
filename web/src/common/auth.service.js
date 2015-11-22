angular
	.module(`${window.APP_NAME}.common`)
	.service('Auth', authService);

const LS_KEY = 'token';
const HEADER = 'Authorization';

function authService ($rootScope, $window, $http, $interval, localStorageService, Constants) {
	var self = this,
		isInitialised = false,
		authUrl = '',
		authPromise;
	
	self.user = {};
	self.isAuthorised = false;
	
	self.authorize = authorize;
	self.updateSessionInfo = updateSessionInfo;
	self.get = get;
	self.openAuthUrl = openAuthUrl;
	
	function authorize () {
		
		return new Promise(function (resolve) {
			
			var authData = localStorageService.get(LS_KEY);
		
			if (!authData) {
				getAuthUrl();
				return resolve(null);
			}
			
			$http.defaults.headers.common[HEADER] = authData.token;
			
			$http.get(Constants.Api.AUTH_ME)
				.then((response) => {
					isInitialised = true;
					self.isAuthorised = true;
					self.user = response.data;
					resolve(self.user);
				})
				.catch(() => {
					isInitialised = true;
					self.isAuthorised = false;
					self.user = {};
					updateSessionInfo();
					getAuthUrl();
					resolve(null);
				});
		});
	}
	
	function get () {
		
		return new Promise(function (resolve) {
			
			if (isInitialised) return resolve(self.user);
			
			var interval = $interval(() => {
				if (!isInitialised) return;
				$interval.cancel(interval);
				resolve(self.user);
				try {
					$rootScope.$digest();
				}
				catch (e) {
					// Do nothing
				}
			}, 100);
		});
	}
	
	function updateSessionInfo (username, token) {
		if (username && token) {
			localStorageService.set(LS_KEY, {token, username});
			$http.defaults.headers.common[HEADER] = token;
		}
		else {
			localStorageService.remove(LS_KEY);
			delete $http.defaults.headers.common[HEADER];
		}
	}
	
	function getAuthUrl () {
		authPromise = $http.get(Constants.Api.AUTH_GET_URL).then(response => authUrl = response.data.url);
	}
	
	function openAuthUrl () {
		if (!authUrl) authPromise.then(openAuthUrl);
		else $window.location.href = authUrl;
	}
}
