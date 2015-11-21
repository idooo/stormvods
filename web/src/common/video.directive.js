/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('video', videoDirective);

const TEMPLATE = `
	<div class="video">
		
		<div class="video__cover" ng-hide="isPlaying">
			
			<div class="video__hide-duration-container">
				<span>Hide Duration</span>
			</div>
			
			<div class="video__play" ng-click="play()"></div>
			
			<div class="video__description"> 
				<span class="video__stage">Semifinal</span>
				<span class="video__tournament"><a href="#">World Championship 2015</a></span>
				<span class="video__type">Best of 3</span>
				<span class="video__teams">
					<a href="#">Natus Vincere</a>
					vs.
					<a href="#">Team Dignitas</a>
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

function videoDirective ($sce) {

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
		scope.getIframeSrc = getIframeSrc;
		scope.play = play;
		
		function getIframeSrc () {
			var url = `https://www.youtube-nocookie.com/embed/${scope.object.youtubeId}?autoplay=1&rel=0&amp;controls=0&amp;showinfo=0"`;
			return $sce.trustAsResourceUrl(url);
		}
		
		function play () {
			scope.isPlaying = true;	
		}

	}
		
}
