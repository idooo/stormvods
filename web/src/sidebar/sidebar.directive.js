angular
	.module(`${window.APP_NAME}.pages`)
	.directive('sidebar', sidebarDirective);

// TODO: #33 fix this conditions

const TEMPLATE = `

	<section ng-if="ctrl.isAddVideoVisible">

		<h1>Add video</h1>

		<div class="sidebar__add-video">

			<p>
				Storm Vods is an experiment to create
				a community-driven spoiler-free catalog of competitive videos
				for <a href="http://us.battle.net/heroes/en/">Heroes of the Storm</a> game.
			</p>
			<p>
				You can help the community by adding
				new videos or improve information for existing vods.
			</p>

			<p>
				At least for now it will require Reddit account
			</p>

			<button ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login/Register</button>

			<button ng-if="$root.isAuthorised" ui-sref="addvideo">Add Video</button>

		</div>

	</section>

	<section ng-if="ctrl.page === 'addvideo'">

		<h1>Add quality</h1>

		<div class="sidebar__add-video">

		</div>

	</secion>

`;

// TODO: add sidebar content ^^^

const ADDVIDEO_NOT_VISIBLE = ['addvideo', 'zone', 'callback', 'error'];

function sidebarDirective () {

	return {
		restrict: 'A',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};

	function controller ($rootScope, Auth) {
		var self = this;

		self.isAddVideoVisible = false;

		$rootScope.$on('$stateChangeStart', (event, toState) => {
			self.page = toState.name;
			self.isAddVideoVisible = ADDVIDEO_NOT_VISIBLE.indexOf(self.page) === -1;
		});

		self.openAuthUrl = Auth.openAuthUrl;
	}
}
