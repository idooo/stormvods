/* global angular, Rx */

angular
	.module(`${window.APP_NAME}.common`)
	.service('Auth', authService);

const ENDPOINT_ME = '/api/users/me';
const LS_KEY = 'token';
const HEADER = 'Authorization';

function authService ($rootScope, $http, localStorageService) {
	var self = this;
	var observers = [];
	
	self.user = {};
	self.isAuth = false;
	
	self.observe = observe;
	self.authorize = authorize;
	self.updateSessionInfo = updateSessionInfo;
	
	var authData = localStorageService.get(LS_KEY);
	
	if (authData) {
		$http.defaults.headers.common[HEADER] = authData.token;
		authorize();	
	}
	
	function authorize () {
		$http.get(ENDPOINT_ME)
			.then((response) => {
				self.isAuth = true;
				self.user = response.data;
				notify();
			})
			.catch((response) => {
				self.isAuth = false;
				self.user = {};
				updateSessionInfo();
				notify();
			});
	}
	
		
	function observe (func) {
		observers.push(func);
		notify(func);
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
	
	function notify (observer) {
		if (angular.isFunction(observer)) return observer(self.isAuth);
		observers.forEach((func) => func(self.isAuth));
	}
	
	return this;
}
