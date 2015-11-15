/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('indexPage', indexPage);

const TEMPLATE = `
	<div>
		index page
		
		<!--
		<iframe 
			width="560" 
			height="315" 
			src="https://www.youtube-nocookie.com/embed/IwoFyRYc_V0?rel=0&amp;controls=0&amp;showinfo=0" 
			frameborder="0" 
			allowfullscreen>
		</iframe>
			
		<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/aJFi3ANmR_w?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
		<div>
			<input type="checkbox" ng-model="ctrl.hideControls">hide controls
		</div>
		-->
		
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
