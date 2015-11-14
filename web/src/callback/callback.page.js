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
	
	function controller ($http, $location) {
		var params = $location.search();
		
		var authPromise = $http.get(ENDPOINT_CALLBACK, {params}).then((response) => {
			console.log(response)
		});
		
	}
		
}
