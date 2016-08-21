const TEMPLATE = `
	<section ng-if="$ctrl.isAdditionalDataAvailable">
	
		<h1>More about team</h1>
	
		<div class="sidebar__block">
	
			<ul>
				<li ng-if="$ctrl.team.website">
					<a ng-href="{{$ctrl.team.website}}">
						Website
					</a>
				</li>
				<li ng-if="$ctrl.team.masterleagueId">
					<img src="/dist/images/third-party/masterleague.png">
					<a ng-href="http://masterleague.net/team/{{$ctrl.team.masterleagueId}}">
						masterleague.net
					</a>
				</li>
				<li ng-if="$ctrl.team.teamLiquidWikiUrl">
					<img src="/dist/images/third-party/wikiteamliquid.png">
					<a ng-href="http://wiki.teamliquid.net/heroes/{{$ctrl.team.teamLiquidWikiUrl}}">
						Team Liquid Wiki
					</a>
				</li>
			</ul>
		</div>
	
	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('teamInfoSidebar', {
		template: TEMPLATE,
		controller: teamInfoSidebarComponent
	});

/**
 * @listens Constants.Event.TeamSelectedEvent
 */
function teamInfoSidebarComponent ($scope, Constants) {
	var self = this;

	self.team = null;
	self.isAdditionalDataAvailable = false;

	$scope.$on(Constants.Event.TeamSelectedEvent, (event, data) => {
		self.team = data;
		self.isAdditionalDataAvailable = !!(data.masterleagueId || data.website || data.teamLiquidWikiUrl);
	});
}
