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

		<h1 ng-if="!ctrl.error && (!ctrl.video.teams.teams || ctrl.video.teams.teams.length == 0)">
			Mysterious match
		</h1>

		<div ng-if="ctrl.error">
			<h1 ng-if="ctrl.error.message === 'NOT_FOUND'">
				Video not found
			</h1>
			<span>
				Sorry, we cannot find video with that id
			</span>
		</div>

		<video object="ctrl.video" ng-if="!ctrl.error"></video>

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

	function controller ($http, $state, Page, Constants) {
		var self = this;

		self.video = {};

		$http.get(`${Constants.Api.VIDEO}/${$state.params.id}`)
			.then(response => {
				self.video = response.data;
				Page.loaded();
				setTitle(self.video);
			})
			.catch(response => {
				self.error = response.data;
				Page.loaded();
				Page.setTitle('Not Found');
			});

		function setTitle (video) {
			if (!video.teams || !video.teams.teams || !video.teams.teams.length) {
				if (video.tournament.name) Page.setTitle(video.tournament.name);
				else Page.setTitle('Mysterious match');
			}
			else Page.setTitle(`${video.teams.teams[0].name} vs ${video.teams.teams[1].name}`);
		}
	}

}
