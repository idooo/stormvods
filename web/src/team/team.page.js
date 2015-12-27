angular
	.module(`${window.APP_NAME}.pages`)
	.directive('teamPage', teamPage);

const TEMPLATE = `
	<section>
		
		<h1>Team: {{ctrl.team.name}}</h1>
			
		<video-list params="ctrl.searchParams" page-load="true"></video-list>
		
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
		self.searchParams = `team=${$state.params.id}`;
		
		if (!$state.params.id) $state.go('teams');
			
		$http.get(`${Constants.Api.LOOKUP}/team?query=${$state.params.id}`)
			.then(response => self.team = response.data);
	}
		
}
