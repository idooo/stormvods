angular
	.module(`${window.APP_NAME}.pages`)
	.directive('zonePage', zonePage);

const TEMPLATE = `
	<section>
		<h1>Zone</h1>
		<users-zone></users-zone>
	</section>
`;

function zonePage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($rootScope, $state, Page, Constants) {
		if (!$rootScope.username || $rootScope.role < Constants.Roles.ADMIN) return $state.go('index');
		
		Page.loaded();
		Page.setTitle('Zone'); 
	}
}
