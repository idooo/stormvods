angular
	.module(`${window.APP_NAME}.pages`)
	.directive('casterPage', casterPage);

const TEMPLATE = `
	<section>
		
		<h1>Caster: {{ctrl.caster.name}}</h1>
			
		<video-list videos="ctrl.videos"></video-list>
		
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
		
		$http.get(`${Constants.Api.GET_VIDEO_LIST}?caster=${$state.params.id}`)
			.then(response => self.videos = response.data.videos);
			
		$http.get(`${Constants.Api.LOOKUP}/caster?query=${$state.params.id}`)
			.then(response => self.caster = response.data);
	}
		
}
