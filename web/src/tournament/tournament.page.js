angular
	.module(`${window.APP_NAME}.pages`)
	.directive('tournamentPage', tournamentPage);

const TEMPLATE = `
	<section>
		
		<h1>Tournament: {{ctrl.tournament.name}}</h1>
			
		<video-list params="ctrl.searchParams" page-load="true"></video-list>
		
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
		self.searchParams = `tournament=${$state.params.id}`;
		
		$http.get(`${Constants.Api.LOOKUP}/tournament?query=${$state.params.id}`)
			.then(response => self.tournament = response.data);
		
	}
}
