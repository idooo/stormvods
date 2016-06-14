const TEMPLATE = `
	<section>
		<h1>Zone</h1>

		<div class="tabs">
			<span
				class="tab"
				ng-class="{'tab--selected': $ctrl.selectedTab === $index}"
				ng-click="$ctrl.selectedTab = $index"
				ng-repeat="tab in $ctrl.tabs">
				{{tab}}
			</span>
		</div>

		<videos-zone ng-if="$ctrl.selectedTab === 0"></videos-zone>
		<users-zone ng-if="$ctrl.selectedTab === 1"></users-zone>
		<teams-zone ng-if="$ctrl.selectedTab === 2"></teams-zone>
		<tournaments-zone ng-if="$ctrl.selectedTab === 3"></tournaments-zone>
		<casters-zone ng-if="$ctrl.selectedTab === 4"></casters-zone>

	</section>
`;

const TABS = ['Videos', 'Users', 'Teams', 'Tournaments', 'Casters'];
const DEFAULT_TAB = 'Videos';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('zonePage', {
		template: TEMPLATE,
		controller: zonePage
	});

function zonePage ($rootScope, $state, Page, Constants) {
	var self = this;

	self.tabs = TABS;
	self.selectedTab = TABS.indexOf(DEFAULT_TAB);

	if (!$rootScope.username || $rootScope.role < Constants.Roles.ADMIN) return $state.go('index');

	Page.loaded();
	Page.setTitle('Zone');

	// Some nasty stuff
	let content = document.getElementsByClassName('content')[0];
	content.style.maxWidth = '100%';
	content.style.width = '95%';
}
