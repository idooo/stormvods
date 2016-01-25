angular
	.module(`${window.APP_NAME}.pages`)
	.directive('zonePage', zonePage);

const TEMPLATE = `
	<section>
		<h1>Zone</h1>

		<div class="tabs">
			<span
				class="tab"
				ng-class="{'tab--selected': ctrl.selectedTab === $index}"
				ng-click="ctrl.selectedTab = $index"
				ng-repeat="tab in ctrl.tabs">
				{{tab}}
			</span>
		</div>

		<videos-zone ng-if="ctrl.selectedTab === 0"></videos-zone>
		<users-zone ng-if="ctrl.selectedTab === 1"></users-zone>
		<entities-zone ng-if="ctrl.selectedTab === 2"></entities-zone>

	</section>
`;

const TABS = ['Videos', 'Users', 'Entities'];

function zonePage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};

	function controller ($rootScope, $state, Page, Constants) {
		var self = this;

		self.tabs = TABS;
		self.selectedTab = 0;

		if (!$rootScope.username || $rootScope.role < Constants.Roles.ADMIN) return $state.go('index');

		Page.loaded();
		Page.setTitle('Zone');

		// Some nasty stuff
		let content = document.getElementsByClassName('content')[0];
		content.style.maxWidth = '100%';
		content.style.width = '95%';
	}
}
