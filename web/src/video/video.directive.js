/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('video', videoDirective);

const TEMPLATE = `
	<div class="video">
	
		<div class="video__hide-duration-container" ng-hide="isPlaying">
			<span 
				class="video__hide-duration-link"
				ng-click="hideDuration = !hideDuration">
				Hide Duration: {{hideDuration ? 'yes' : 'no'}}
			</span>
		</div>
		
		<div class="video__cover" ng-hide="isPlaying">
			
			<div class="video__play" ng-click="play()"></div>
			
			<div class="video__description"> 
				<span class="video__stage">{{object.stage.name}}</span>
				<span class="video__tournament">
					<a href="#" ui-sref="tournament({id: object.tournament._id})">{{object.tournament.name}}</a>
				</span>
				<span class="video__format">{{object.format.name}}</span>
				<span class="video__teams" ng-if="object.teams.teams.length">
					<span ng-hide="isTeamVisible">
						<a ng-click="showTeams()">Show teams</a>
					</span>
					<span ng-show="isTeamVisible">
						<a href="#" ui-sref="team({id: object.teams.teams[0]._id})">
							{{object.teams.teams[0].name}}
						</a>
						vs.
						<a href="#" ui-sref="team({id: object.teams.teams[1]._id})">
							{{object.teams.teams[1].name}}
						</a>
					</span>
				</span>
				
				<span class="video__casters" ng-if="object.casters.casters.length">
					Casted by:
					<span ng-repeat="caster in object.casters.casters">
						<a href="#" ui-sref="caster({id: caster._id})">{{caster.name}}</a><span ng-if="!$last">,<span>
					</span>
				</span>
			</div>
			
		</div>
		
		<rating video="object" class="rating--video-object"></rating>
	
		<div ng-if="isPlaying" class="video__wrapper">
		
			<iframe 
				ng-src="{{getIframeSrc()}}"
				frameborder="0" 
				allowfullscreen>
			</iframe>
			
		</div>
		
		<improve-block></improve-block>

	</div>
`;

function videoDirective ($sce, $http, $rootScope, Constants) {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			object: '='
		},
		template: TEMPLATE,
		link: link
	};
	
	function link (scope) {
			
		scope.isPlaying = false;
		scope.isTeamVisible = false; 
		scope.hideDuration = true;
		
		scope.getIframeSrc = getIframeSrc;
		scope.showTeams = showTeams;
		scope.play = play;
		
		// Listen for the incoming object to apply some formatting
		scope.$watch('object', function (newValue) {
			if (!newValue || !newValue.stage) return;
			if (newValue.stage) scope.object.stage.name = Constants.Stages[newValue.stage.code];
			if (newValue.format) scope.object.format.name = Constants.Formats[newValue.format.code];
		});
		
		// Listen for global changes to apply app level config to the video
		$rootScope.$watch('isDurationHidden', function (newValue, oldValue) {
			if (typeof newValue === 'boolean' && newValue !== oldValue) scope.hideDuration = newValue;
		});
		$rootScope.$watch('isTeamVisible', function (newValue, oldValue) {
			if (typeof newValue === 'boolean' && newValue !== oldValue) scope.isTeamVisible = newValue;
		});
		
		function getIframeSrc () {
			var controls = scope.hideDuration ? 'controls=0&amp;' : '',
				url = `https://www.youtube.com/embed/${scope.object.youtubeId}?autoplay=1&rel=0&amp;${controls}showinfo=0"`;
				
			return $sce.trustAsResourceUrl(url);
		}
		
		function play () {
			scope.isPlaying = true;	
		}
		
		function showTeams () {
			scope.isTeamVisible = true;
			return false;
		}
	}
}
