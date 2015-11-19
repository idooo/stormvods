angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videoPage', videoPage);

const TEMPLATE = `
	<div>
		<!--
		
			
		<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/aJFi3ANmR_w?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
		<div>
			<input type="checkbox" ng-model="ctrl.hideControls">hide controls
		</div>
		-->
		
		video page
		
		{{ctrl.video}}
		
		<div ng-if="ctrl.video._id">
			<iframe 
				width="560" 
				height="315" 
				ng-src="{{ctrl.getIframeSrc()}}"
				frameborder="0" 
				allowfullscreen>
			</iframe>
		</div>
		
	</div>
`;

function videoPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $state, $sce, Constants) {
		var self = this;
		
		// TODO: if !$state.params.id -> not found page
		
		self.video = {};
		
		self.getIframeSrc = getIframeSrc;
		
		// TODO: handle 404
		
		$http.get(`${Constants.Api.GET_VIDEO}/${$state.params.id}`)
			.then(response => {
				self.video = response.data;
			});
			
		function getIframeSrc () {
			var url = `https://www.youtube-nocookie.com/embed/${self.video.youtubeId}?rel=0&amp;controls=0&amp;showinfo=0"`;
			return $sce.trustAsResourceUrl(url);
		}
	}
		
}
