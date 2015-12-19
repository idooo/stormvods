/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('indexPage', indexPage);

const TEMPLATE = `
	<section>
		
		<h1>Top rated today</h1>
		
		Top: 
			<a href="#" ui-sref="top({mode: 'week'})">week</a>
			<a href="#" ui-sref="top({mode: 'month'})">month</a>
			<a href="#" ui-sref="top({mode: 'alltime'})">all time</a>
			
			<br><br>
			
		<video object="ctrl.today"></video>
		
	</section>
	
	<section>
		
		<h1>Recently added</h1>
		
		<video-list videos="ctrl.videos"></video-list>
		
	</section>
`;

function indexPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, Constants) {
		var self = this;
		
		self.videos = [];
		self.currentPage = 1;
		self.pageCount = 1;
		
		$http.get(Constants.Api.GET_VIDEO_LIST)
			.then(response => {
				self.videos = response.data.videos.map(video => {
					if (video.stage) video.stage = Constants.Stages[video.stage.code];
					return video;
				});
				self.pageCount = response.data.pageCount;
			});
		
		$http.get(`${Constants.Api.GET_VIDEO_TOPLIST}?mode=today`)
			.then(response => {
				self.today = response.data.videos[0];
			});
	}
		
}
