/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('indexPage', indexPage);

const TEMPLATE = `
	<div>
		index page
	</div>
`;

function indexPage () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE,
		link: link,
		controller: controller
	};
	
	function link (scope, element) {

	}
	
	function controller () {
		
	}
		
}
