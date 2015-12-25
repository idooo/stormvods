angular
	.module(`${window.APP_NAME}.pages`)
	.directive('casterPage', casterPage);

const TEMPLATE = `
	<section>
		
		<h1>Caster: {{ctrl.caster.name}}</h1>
			
		<video-list params="ctrl.searchParams" page-load="true"></video-list>
		
	</section>
	
`;

function casterPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $state, Constants) {
		var self = this;
		
		self.videos = [];
		self.caster;
		self.searchParams = `caster=${$state.params.id}`;
			
		$http.get(`${Constants.Api.LOOKUP}/caster?query=${$state.params.id}`)
			.then(response => self.caster = response.data);
	}
		
}
