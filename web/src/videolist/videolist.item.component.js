const TEMPLATE = `
	<div class="video-list-item">

		<rating video="$ctrl.video"></rating>
		
		<div class="video-list-item__inner-container">
	
			<div
				class="video-list-item__info"
				ui-sref="video({id: $ctrl.video._id})">
	
				<div class="video-list-item__tournament">
				
					{{$ctrl.video.tournament.name || 'Mysterious match'}}
	
					<img 
						ng-if="$ctrl.video.tournament.series"
						ng-src="/dist/images/tournaments/{{$ctrl.video.tournament.series + '.png'}}">
		
					<span class="video-list-item__time">
						{{$ctrl.video.tournament.date | amDateFormat:'MMMM YYYY'}}
					</span>
					
				</div>
	
				<div class="video-list-item__stage" ng-if="$ctrl.video.stage">
					{{$ctrl.video.stage }}
				</div>
	
			</div>
	
			<div
				class="video-list-item__teams"
				ng-show="$ctrl.isTeamVisible || $ctrl.video.isTeamVisible"
				ui-sref="video({id: $ctrl.video._id})">
	
				<div class="video-list-item__team-name">
					{{$ctrl.video.teams.teams[0].name}}
				</div>
				<div class="video-list-item__team-logo">
					<img ng-src="/dist/images/teams/{{$ctrl.video.teams.teams[0].image || 'unknown.png'}}">
				</div>
				<div class="vs">vs</div>
				<div class="video-list-item__team-logo">
					<img ng-src="/dist/images/teams/{{$ctrl.video.teams.teams[1].image || 'unknown.png'}}">
				</div>
				<div class="video-list-item__team-name">
					{{$ctrl.video.teams.teams[1].name}}
				</div>
	
			</div>
			
			<div
				class="video-list-item__show-teams"
				ng-hide="$ctrl.isTeamVisible || $ctrl.video.isTeamVisible">
				<span ng-click="$ctrl.video.isTeamVisible = true; $event.stopPropagation();">
					Show Teams
				</span>
			</div>
			
		</div>

	</div>
`;

angular
	.module(`${window.APP_NAME}.common`)
	.component('videoListItem', {
		bindings: {
			video: '='
		},
		template: TEMPLATE,
		controller: videoListItem
	});

function videoListItem ($rootScope) {
	var self = this;

	self.isTeamVisible = $rootScope.isTeamVisible;
	self.showTeams = showTeams;

	$rootScope.$watch('isTeamVisible', (newValue, oldValue) => {
		if (typeof newValue === 'boolean' && newValue !== oldValue) self.isTeamVisible = newValue;
	});

	function showTeams (video, $event) {
		video.isTeamVisible = true;
		$event.stopPropagation();
		return false;
	}
}
