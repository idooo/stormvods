/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('indexPage', indexPage);

const TEMPLATE = `
	<section>
		
		<h1>Most popular today</h1>
			
		<video object="ctrl.videos[ctrl.videos.length - 1]"></video>
		
	</section>
	
	<video-list videos="ctrl.videos" skip-first="true"></video-list>
	
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
		
		$http.get(Constants.Api.GET_VIDEO_LIST)
			.then(response => self.videos = response.data.videos);
	}
		
}
