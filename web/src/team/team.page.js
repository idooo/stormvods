angular
	.module(`${window.APP_NAME}.pages`)
	.directive('teamPage', teamPage);

const TEMPLATE = `
	<section>
		
		<h1>Team: {{ctrl.team.name}}</h1>
			
		<video-list videos="ctrl.videos"></video-list>
		
	</section>
	
`;

function teamPage () {

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
		self.team;
		
		$http.get(`${Constants.Api.GET_VIDEO_LIST}?team=${$state.params.id}`)
			.then(response => self.videos = response.data.videos);
			
		$http.get(`${Constants.Api.LOOKUP}/team?query=${$state.params.id}`)
			.then(response => self.team = response.data);
	}
		
}
