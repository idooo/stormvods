/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('auth', authDirective);

const TEMPLATE = `
	<div>
		Auth link will be here <a href="#" ng-click="ctrl.openAuthUrl()">aa</a>
	</div>
`;

const ENDPOINT_GET_URL = '/api/auth/url';
const ENDPOINT_ME = '/api/users/me';

function authDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: {
			
		},
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $window) {
		
		this.openAuthUrl = openAuthUrl;
		
		var authUrl = '';
		var authPromise = $http.get(ENDPOINT_GET_URL).then((response) => {
			authUrl = response.data.url;
		});
		
		$http.get(ENDPOINT_ME).then((response) => {
			console.log(response)
		});
		
		function openAuthUrl () {
			if (!authUrl) authPromise.then(openAuthUrl);
			else $window.location.href = authUrl;
		}
	}
}
