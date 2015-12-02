angular
	.module(`${window.APP_NAME}.pages`)
	.directive('tournamentPage', tournamentPage);

const TEMPLATE = `
	<section>
		
		<h1>Tournament: {{ctrl.tournament.name}}</h1>
			
		<video-list videos="ctrl.videos"></video-list>
		
	</section>
	
`;

function tournamentPage () {

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
		self.tournament;
		
		$http.get(`${Constants.Api.GET_VIDEO_LIST}?tournament=${$state.params.id}`)
			.then(response => self.videos = response.data.videos);
			
		$http.get(`${Constants.Api.LOOKUP}/tournament?query=${$state.params.id}`)
			.then(response => self.tournament = response.data);
	}
		
}
