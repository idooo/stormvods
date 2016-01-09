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
	
		<div 
			ng-if="isPlaying && object.youtubeId.length !== 1"
		 	class="video__game-tabs">
		
			<span
				class="video__game-tab"
				ng-class="{'video__game-tab--selected': selectedGame === $index + 1}" 
				ng-repeat="i in object.youtubeId track by $index"
				ng-click="selectGame($index + 1)">Game {{$index + 1}}</span>
			
		</div>
	
		<div ng-if="isPlaying" class="video__wrapper">
		
			<div ng-repeat="id in object.youtubeId track by $index">
			
				<iframe 
					ng-if="selectedGame === $index + 1"
					ng-src="{{getIframeSrc(id)}}"
					frameborder="0" 
					allowfullscreen>
				</iframe>
			
			</div>
		</div>
		
		<improve-block ng-if="$root.isAuthorised"></improve-block>

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
		scope.autoPlay = true;
		scope.selectedGame = 1;
		
		scope.getIframeSrc = getIframeSrc;
		scope.showTeams = showTeams;
		scope.play = play;
		scope.selectGame = selectGame;
		
		// Listen for the incoming object to apply some formatting
		scope.$watch('object', function (newValue) {
			if (!newValue || !newValue.stage) return;
			if (newValue.stage) scope.object.stage.name = Constants.Stages[newValue.stage.code];
			if (newValue.format) scope.object.format.name = Constants.Formats[newValue.format.code];
			
			if (newValue.youtubeId.length > 1) {
				// disable autoplay if there are more than one video 
				scope.autoPlay = false; 
				// Fill videos for games weren't played to avoid spoilers
				if (newValue.format.code) {
					let maxGames = parseInt(newValue.format.code.slice(-1), 10);
					for (let i = newValue.youtubeId.length; i < maxGames; i++) newValue.youtubeId.push('');
				}
			}
		});
		
		// Listen for global changes to apply app level config to the video
		$rootScope.$watch('isDurationHidden', function (newValue, oldValue) {
			if (typeof newValue === 'boolean' && newValue !== oldValue) scope.hideDuration = newValue;
		});
		$rootScope.$watch('isTeamVisible', function (newValue, oldValue) {
			if (typeof newValue === 'boolean' && newValue !== oldValue) scope.isTeamVisible = newValue;
		});
		
		// TODO: Support multiple videos per match
		function getIframeSrc (youtubeId) {
			var controls = scope.hideDuration ? 'controls=0&amp;' : '',
				url = `https://www.youtube.com/embed/${youtubeId}?${scope.autoPlay ? 'autoplay=1&' : ''}rel=0&amp;${controls}showinfo=0"`;
				
			return $sce.trustAsResourceUrl(url);
		}
		
		function play () {
			scope.isPlaying = true;	
		}
		
		function showTeams () {
			scope.isTeamVisible = true;
			return false;
		}
		
		function selectGame (index) {
			scope.selectedGame = index;
		}
	}
}
