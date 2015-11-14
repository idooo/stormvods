/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('auth', authDirective);

const TEMPLATE = `
	<div>
		<div style="color: white" ng-if="ctrl.isAuth">
			Welcome, {{ctrl.user.name}}
		</div>
		<a style="color: white" href="#" ng-if="!ctrl.isAuth" ng-click="ctrl.openAuthUrl()">Login</a>
	</div>
`;

const ENDPOINT_GET_URL = '/api/auth/url';

function authDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $window, Auth) {
		
		this.openAuthUrl = openAuthUrl;
		
		var authUrl = '';
		var authPromise = $http.get(ENDPOINT_GET_URL).then((response) => {
			authUrl = response.data.url;
		});
		
		Auth.observe((isAuth) => {
			this.isAuth = isAuth;
			this.user = Auth.user;
		});
			
		function openAuthUrl () {
			if (!authUrl) authPromise.then(openAuthUrl);
			else $window.location.href = authUrl;
		}
	}
}
