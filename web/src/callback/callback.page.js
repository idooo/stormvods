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
	
	function controller ($http, $window, Page) {
		var params = {};
		
		$window.location.search
			.replace('?', '')
			.split('&')
			.forEach(item => {
				var i = item.split('=');
				params[i[0]] = i[1];
			});
			
		Page.loaded();
			
		// TODO: handle errors
		$http.get(ENDPOINT_CALLBACK, {params}).then(() => $window.location.assign('/'));
	}
		
}
