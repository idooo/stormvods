/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('callbackPage', callbackPage);

const TEMPLATE = `
	<div>
		Callback page
	</div>
`;

const ENDPOINT_CALLBACK = '/api/auth/callback';

function callbackPage () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $window, $state, Auth) {
		var params = {};
		$window.location.search
			.replace('?', '')
			.split('&')
			.forEach(item => {
				var i = item.split('=');
				params[i[0]] = i[1];
			});
			
		// TODO: handle errors
		$http.get(ENDPOINT_CALLBACK, {params}).then((response) => {
			Auth.updateSessionInfo(response.data.username, response.data.sessionId);
			$state.go('index');
		});
		
	}
		
}
