/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('video', videoDirective);

const TEMPLATE = `
	<div class="video">
		
		<div class="video__cover" ng-hide="isPlaying">
			
			<div class="video__hide-duration-container">
				<checkbox label="Hide Duration" value="hideDuration"></checkbox>
			</div>
			
			<div class="video__play" ng-click="play()"></div>
			
			<div class="video__description"> 
				<span class="video__stage">{{object.stage.name}}</span>
				<span class="video__tournament">
					<a href="#" ui-sref="tournament({id: object.tournament._id})">{{object.tournament.name}}</a>
				</span>
				<span class="video__format">{{object.format.name}}</span>
				<span class="video__teams" ng-if="object.teams.teams.length">
					<span ng-hide="showTeams">
						<a ng-click="toggleTeams()">Show teams</a>
					</span>
					<span ng-show="showTeams">
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
	
		<div ng-if="isPlaying">
		
			<iframe 
				ng-src="{{getIframeSrc()}}"
				frameborder="0" 
				allowfullscreen>
			</iframe>
			
		</div>
		
	</div>
`;

function videoDirective ($sce, Constants) {

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
		scope.showTeams = false; 
		scope.hideDuration = true;
		
		scope.getIframeSrc = getIframeSrc;
		scope.toggleTeams = toggleTeams;
		scope.play = play;
		
		scope.$watch('object', function (newValue) {
			if (!newValue || !newValue.stage) return;
			if (newValue.stage) scope.object.stage.name = Constants.Stages[newValue.stage.code];
			if (newValue.format) scope.object.format.name = Constants.Formats[newValue.format.code];
		});
		
		function getIframeSrc () {
			var controls = scope.hideDuration ? 'controls=0&amp;' : '',
				url = `https://www.youtube-nocookie.com/embed/${scope.object.youtubeId}?autoplay=1&rel=0&amp;${controls}showinfo=0"`;
				
			return $sce.trustAsResourceUrl(url);
		}
		
		function play () {
			scope.isPlaying = true;	
		}
		
		function toggleTeams () {
			scope.showTeams = !scope.showTeams;
			return false;
		}

	}
		
}
