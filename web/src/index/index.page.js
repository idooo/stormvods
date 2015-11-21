/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('indexPage', indexPage);

const TEMPLATE = `
	<div class="page">
	
		<section>
			
			<h1>Most popular today</h1>
				
			<video object="ctrl.videos[ctrl.videos.length - 1]"></video>
			
		</section>
			
		<div ng-repeat="video in ctrl.videos">
			<a href="#" ui-sref="video({id: video._id})">{{video.youtubeId || 'broken'}}</a>	
		</div>
		
	</div>
`;

function indexPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, Constants) {
		var self = this;
		
		self.videos = [];
		
		$http.get(Constants.Api.GET_VIDEO_LIST)
			.then(response => self.videos = response.data);
	}
		
}
