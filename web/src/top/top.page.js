angular
	.module(`${window.APP_NAME}.pages`)
	.directive('topPage', topPage);

const TEMPLATE = `
	<section>
		
		<h1>Top rated: {{ctrl.mode.name}}</h1>
			
		<video-list videos="ctrl.videos" show-pagination="false"></video-list>
		
	</section>
	
`;

function topPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $state, Page, Constants) {
		var self = this;
		
		self.videos = [];
		self.mode = Constants.Top[1]; // Week by default
		
		Constants.Top.forEach(top => {
			if ($state.params.mode === top.code) self.mode = top;
		});
		
		$http.get(`${Constants.Api.GET_VIDEO_TOPLIST}?mode=${self.mode.code}`)
			.then(response => {
				self.videos = response.data.videos.map(video => {
					if (video.stage) video.stage = Constants.Stages[video.stage.code];
					return video;
				});
				Page.loaded();
			});
	}
		
}
