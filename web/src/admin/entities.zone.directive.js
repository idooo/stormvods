angular
	.module(`${window.APP_NAME}.pages`)
	.directive('entitiesZone', entitiesZoneDirective);

const TEMPLATE = `
	<div>
		<h2>Entities</h2>

		<div>

		</div>
	</div>
`;

function entitiesZoneDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};

	function controller () {

	}
}
