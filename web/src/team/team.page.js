angular
	.module(`${window.APP_NAME}.pages`)
	.directive('teamPage', teamPage);

const TEMPLATE = `
	<section>
		
		<h1>Team: {{ctrl.team.name}}</h1>
			
		<video-list params="ctrl.searchParams"></video-list>
		
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
	
	function controller ($http, $state, Page, Constants) {
		var self = this;
		
		self.videos = [];
		self.team;
		self.searchParams = `team=${$state.params.id}`;
			
		$http.get(`${Constants.Api.LOOKUP}/team?query=${$state.params.id}`)
			.then(response => {
				self.team = response.data;
				Page.loaded();
			});
	}
		
}
