/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('videoContainer', videoDirective);

const TEMPLATE = `
	<div>
		{{video}}	
	</div>
`;

function videoDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			video: '='
		},
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller () {
		this.isMenuHidden = true;
	}
		
}
