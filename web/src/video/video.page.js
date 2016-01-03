angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videoPage', videoPage);

const TEMPLATE = `
	<section>

		<h1 ng-if="ctrl.video.teams.teams.length">
			<a href="#" ui-sref="team({id: ctrl.video.teams.teams[0]._id})">{{ctrl.video.teams.teams[0].name}}</a>
			<small class="newline-mobile">vs.</small>
			<a href="#" ui-sref="team({id: ctrl.video.teams.teams[1]._id})">{{ctrl.video.teams.teams[1].name}}</a>
		</h1>
		<h1 ng-if="!ctrl.video.teams || ctrl.video.teams.teams.length == 0">Video</h1>

		<video object="ctrl.video"></video>

	</section>
`;

function videoPage () {

	return {
		restrict: 'E',
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};

	function controller ($http, $rootScope, $state, $sce, Page, Constants) {
		var self = this;

		self.video = {};
		
		// TODO: handle 404 if !$state.params.id -> not found page

		$http.get(`${Constants.Api.VIDEO}/${$state.params.id}`)
			.then(response => {
				self.video = response.data;
				Page.loaded();
				setTitle(self.video);
			});

		function setTitle (video) {
			if (!video.teams || !video.teams.teams.length) return;
			Page.setTitle(`${video.teams.teams[0].name} vs ${video.teams.teams[1].name}`);
		}
	}

}
