const TEMPLATE = `
	<section class="entity-page">

		<h1>
			<img
				class="entity-page__image"
				ng-src="/dist/images/teams/{{$ctrl.team.image || 'unknown.png'}}">

			{{ctrl.team.name}}
		</h1>

		<video-list params="$ctrl.searchParams" page-load="true"></video-list>

	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('teamPage', {
		template: TEMPLATE,
		controller: teamPage
	});

function teamPage ($http, $state, Page, Constants) {
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
