const TEMPLATE = `
	<section ng-if="$ctrl.isAdditionalDataAvailable">
	
		<h1>Statistics</h1>
	
		<div class="sidebar__block">
	
			<p>
				You can find statistics and replay files for this tournament here:
			</p>
		
			<ul>
				<li ng-if="$ctrl.tournament.masterleagueId">
					<img src="/dist/images/third-party/masterleague.png">
					<a ng-href="http://masterleague.net/tournament/{{$ctrl.tournament.masterleagueId}}">
						masterleague.net
					</a>
				</li>
				<li ng-if="$ctrl.tournament.hotslogsId">
					<img src="/dist/images/third-party/hotslogs.png">
					<a ng-href="http://www.hotslogs.com/Event/Overview?EventID={{$ctrl.tournament.hotslogsId}}">
						HotsLogs
					</a>
				</li>
				<li ng-if="$ctrl.tournament.teamLiquidWikiUrl">
					<img src="/dist/images/third-party/wikiteamliquid.png">
					<a ng-href="http://wiki.teamliquid.net/heroes/{{$ctrl.tournament.teamLiquidWikiUrl}}">
						Team Liquid Wiki
					</a>
				</li>
			</ul>
		</div>
	
	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('tournamentInfoSidebar', {
		template: TEMPLATE,
		controller: tournamentInfoSidebarComponent
	});

/**
 * @listens Constants.Event.TournamentSelectedEvent
 */
function tournamentInfoSidebarComponent ($scope, Constants) {
	var self = this;

	self.tournament = null;
	self.isAdditionalDataAvailable = false;

	$scope.$on(Constants.Event.TournamentSelectedEvent, (event, data) => {
		self.tournament = data;
		self.isAdditionalDataAvailable = !!(data.masterleagueId || data.hotslogsId || data.teamLiquidWikiUrl);
	});
}
