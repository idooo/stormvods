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

	function controller ($http, $state, Page, Constants) {
		var self = this;

		self.videos = [];
		self.tournament = undefined;
		self.searchParams = `tournament=${$state.params.id}`;

		$http.get(`${Constants.Api.LOOKUP}/tournament?id=${$state.params.id}`)
			.then(response => {
				if (!response.data.values || !response.data.values.length) return notFound();
				self.tournament = response.data.values[0];
				Page.setTitle(self.tournament.name);
			})
			.catch(notFound);

		function notFound () {
			$state.go('error', {error: 'TOURNAMENT_NOT_FOUND'});
		}
	}
}
