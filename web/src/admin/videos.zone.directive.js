angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videosZone', videosZoneDirective);

const TEMPLATE = `
	<div>
		<h2>Videos</h2>
		
		
	</div>
`;

function videosZoneDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, Constants) {
		var self = this;
		
	}
}
