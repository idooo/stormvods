/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('videoList', videoListDirective);

const TEMPLATE = `
	<div class="video-list">
	
		<div 
			class="video-list-item"
			ng-repeat="video in ctrl.videos">
		
			<rating video="video"></rating>
			
			<div class="video-list-item__main" ui-sref="video({id: video._id})">
			
				<div class="video-list-item__secondary">
					Added <span am-time-ago="video.creationDate"></span>
					by {{video.author.name}}
				</div>
				
				<div class="video-list-item__info">
				
					<div>
						<a href="#" ui-sref="tournament({id: video.tournament.id})">{{video.tournament.name}}</a>
						{{video.stage}}
					</div>
					 
					<div> 
						{{video.teams.teams[0].name}} vs {{video.teams.teams[1].name}}
						<br>
						Casted by 
						<span ng-repeat="caster in video.casters.casters">
							<a href="#">{{caster.name}}</a>
							<span ng-if="!$last">,<span>
						</span>
					</div>
					
				</div>
			</div>		
		</div>

		<div class="pagination" ng-if="ctrl.showPagination">
		
			<button 
				class="secondary" 
				ng-disabled="ctrl.currentPage <= 1"
				ng-click="ctrl.getVideos(ctrl.currentPage-1)">
				
				&larr; Prev
			</button>
			
			<button 
				class="secondary" 
				ng-disabled="ctrl.pageCount == ctrl.currentPage"
				ng-click="ctrl.getVideos(ctrl.currentPage+1)">
				
				Next &rarr;
			</button>
		
		</div>
		
	</div>
`;

function videoListDirective () {

	return {
		restrict: 'E',
		replace: true,
		scope: {},
		bindToController: {
			params: '=?',
			showPagination: '=?',
			videos: '=?'
		},
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope, $http, Constants) {
		var self = this;
		
		self.currentPage = 1;
		self.pageCount = 0;
		
		self.getVideos = getVideos;
		
		if (!self.videos) getVideos(self.currentPage);
		
		if (typeof self.showPagination === 'undefined') self.showPagination = true;
		
		function getVideos (page) {
			let url = `${Constants.Api.GET_VIDEO_LIST}?p=${page}`;
			if ($scope.params) url += `&${$scope.params}`;
			
			self.videos = [];
			
			$http.get(url)
				.then(response => {
					self.currentPage = page;
					self.pageCount = response.data.pageCount;
					self.videos = response.data.videos.map(video => {
						if (video.stage) video.stage = Constants.Stages[video.stage.code];
						return video;
					});
				});
		}
	}
}
