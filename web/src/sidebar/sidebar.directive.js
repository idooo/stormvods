angular
	.module(`${window.APP_NAME}.pages`)
	.directive('sidebar', sidebarDirective);

// TODO: #33 fix this conditions

const TEMPLATE = `

	<section ng-if="ctrl.isAddVideoVisible">

		<h1>Add video</h1>

		<div class="sidebar__block">

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
				At least for now registration requires your Reddit account
				(no password)
			</p>

			<button ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login/Register</button>

			<button ng-if="$root.isAuthorised" ui-sref="addvideo">Add Video</button>

		</div>

	</section>

	<section ng-if="ctrl.page === 'addvideo'">

		<h1>Quality first</h1>

		<div class="sidebar__block">
			<div class="sidebar__header">Short guidelines</div>
			<ul>
				<li>
					Video must contain at least one competitive Heroes of the Storm
					full match
				</li>
				<li>
					Should be a match between two professional Heroes of the Storm teams
				</li>
				<li>
					Game should have commentary in English by a caster
				</li>
				<li>
					Use <a href="http://wiki.teamliquid.net/heroes/Main_Page" target="_blank">Team Liquid Wiki</a>
					as a source of correct names
					for <a href="http://wiki.teamliquid.net/heroes/Portal:Teams" target="_blank" >teams</a>
					and <a href="http://wiki.teamliquid.net/heroes/Portal:Tournaments" target="_blank">tournaments</a>
				</li>
			</ul>

			<div class="sidebar__header">Please don't</div>
			<ul>
				<li>
					Don't add highlight videos, WTF, funny moments or other videos that
					don't contain full competitive Heroes of the Storm match
				</li>
				<li>
					Don't add videos with commentaries on other than English languages
				</li>
			</ul>
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
