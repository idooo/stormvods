const TEMPLATE = `
	<section>

		<h1>Caster: {{ctrl.caster.name}}</h1>

		<video-list params="$ctrl.searchParams" page-load="true"></video-list>

	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('casterPage', {
		template: TEMPLATE,
		controller: casterPage
	});

function casterPage ($http, $state, Page, Constants) {
	var self = this;

	self.videos = [];
	self.caster = undefined;
	self.searchParams = `caster=${$state.params.id}`;

	$http.get(`${Constants.Api.LOOKUP}/caster?id=${$state.params.id}`)
		.then(response => {
			if (!response.data.values || !response.data.values.length) return notFound();
			self.caster = response.data.values[0];
			Page.setTitle(self.caster.name);
		})
		.catch(notFound);

	function notFound () {
		$state.go('error', {error: 'CASTER_NOT_FOUND'});
	}
}
