angular
	.module(`${window.APP_NAME}.pages`)
	.directive('teamPage', teamPage);

const TEMPLATE = `
	<section class="entity-page">

		<h1>
			<img
				class="entity-page__image"
				ng-src="/dist/images/teams/{{ctrl.team.image || 'unknown.png'}}">

			{{ctrl.team.name}}
		</h1>

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

	function controller ($http, $state, Page, Constants) {
		var self = this;

		self.videos = [];
		self.team = undefined;
		self.searchParams = `team=${$state.params.id}`;

		if (!$state.params.id) $state.go('teams');

		$http.get(`${Constants.Api.LOOKUP}/team?id=${$state.params.id}`)
			.then(response => {
				if (!response.data.values || !response.data.values.length) return notFound();
				self.team = response.data.values[0];
				Page.setTitle(self.team.name);
			})
			.catch(notFound);

		function notFound () {
			$state.go('error', {error: 'TEAM_NOT_FOUND'});
		}
	}
}
