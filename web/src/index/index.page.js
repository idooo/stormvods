/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('indexPage', indexPage);

const TEMPLATE = `
	<section>
		
		<h1>Most popular today</h1>
			
		<video object="ctrl.videos[ctrl.videos.length - 1]"></video>
		
	</section>
	
	<section>
		
		<h1>Recently added</h1>
		
		<video-list videos="ctrl.videos" skip-first="true"></video-list>
		
		<div class="pagination">
			<ul>
				<li class="page-prev">
					<a href="javascript:void(0)" ng-if="ctrl.currentPage != 1">Prev</a>
				</li>
				<li class="page-next" ng-if="ctrl.pageCount > ctrl.currentPage">
					<a href="javascript:void(0)">Next</a>
				</li>
			</ul>
		</div>
		
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
				self.videos = response.data.videos;
				self.pageCount = response.data.pageCount;
			});
	}
		
}
