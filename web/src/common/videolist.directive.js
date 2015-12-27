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
			
			<div class="video-list-item__info" ui-sref="video({id: video._id})">
			
				<div class="video-list-item__time" am-time-ago="video.creationDate"></div>
				
				<div class="video-list-item__main">
					<span>{{video.tournament.name}}</span>
						
					<div class="video-list-item__stage mobile-only"> 
						{{video.stage}}
					</div>
					
					<div class="video-list-item__teams">
						<span ng-show="ctrl.isTeamVisible || video.isTeamVisible">
							{{video.teams.teams[0].name}}
							<small>vs</small> 
							{{video.teams.teams[1].name}}
						</span>
						<div 
							class="video-list-item__show-teams"
							ng-hide="ctrl.isTeamVisible || video.isTeamVisible"
							ng-click="video.isTeamVisible = true; $event.stopPropagation();">
							Show teams
						</div>
					</div>
				</div>
			
				<div class="video-list-item__stage mobile-hidden"> 
					{{video.stage}}
				</div>
				
				<div class="video-list-item__casters">
					Casted by 
					<span ng-repeat="caster in video.casters.casters">
						{{caster.name}}
						<span ng-if="!$last">,<span>
					</span>
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
			videos: '=?',
			pageLoad: '@'
		},
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope, $rootScope, $http, Page, Constants) {
		var self = this;
		
		self.currentPage = 1;
		self.pageCount = 0;
		self.isTeamVisible = $rootScope.isTeamVisible;
		
		self.getVideos = getVideos;
		self.showTeams = showTeams;
		
		if (!self.videos) getVideos(self.currentPage);
		
		if (typeof self.showPagination === 'undefined') self.showPagination = true;
		
		$rootScope.$watch('isTeamVisible', function (newValue, oldValue) {
			if (typeof newValue === 'boolean' && newValue !== oldValue) self.isTeamVisible = newValue;
		});
		
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
					if (self.pageLoad) Page.loaded();
				});
		}
		
		function showTeams (video, $event) {
			video.isTeamVisible = true;
			$event.stopPropagation();
			return false;
		}
	}
}
