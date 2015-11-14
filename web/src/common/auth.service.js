/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.service('Auth', authService);

const LS_KEY = 'token';
const HEADER = 'Authorization';

function authService ($http, localStorageService) {
	
	this.updateSessionInfo = function (username, sessionId) {
		if (username && sessionId) {
			localStorageService.set(LS_KEY, {sessionId, username});
			$http.defaults.headers.common[HEADER] = sessionId;
		}
		else {
			localStorageService.remove(LS_KEY);
			delete $http.defaults.headers.common[HEADER];
		}
	};
	
	return this;
}
