/* global angular */

angular
	.module(`${window.APP_NAME}.common`)
	.directive('videoList', videoListDirective);

const TEMPLATE = `
	<div class="video-list">
	
		<div 
			class="video-list-item"
			ng-repeat="video in ctrl.videos">
		
			<svg 
				class="video-list-item__rating"
				version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				width="38" height="38" viewBox="0 0 87.59 99.306" xml:space="preserve">
				<g>
					<path stroke="#c9c9c9"
						fill="transparent" 
						stroke-miterlimit="10" d="M45.377,98.392c-0.953,0.55-2.513,0.552-3.467,0.005l-39.68-22.75
						c-0.954-0.547-1.732-1.895-1.729-2.995l0.139-45.739c0.003-1.1,0.785-2.45,1.738-3l39.837-23c0.953-0.55,2.513-0.552,3.467-0.005
						l39.68,22.75c0.954,0.547,1.732,1.895,1.729,2.995l-0.139,45.739c-0.003,1.1-0.785,2.45-1.738,3L45.377,98.392z"/>
					<text x="44" y="62" fill="#62835c" text-anchor="middle" font-size="36">{{video.rating}}</text>
					<text x="44" y="70" fill="#ffffff" text-anchor="middle" font-size="60">+</text>		
				</g>
			</svg>
		
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
		
		<div class="pagination">
		
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
		scope: {
			params: '=?'
		},
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope, $http, Constants) {
		var self = this;
		
		self.videos = [];
		self.currentPage = 1;
		self.pageCount = 0;
		
		self.getVideos = getVideos;
		
		getVideos(self.currentPage);
		
		function getVideos (page) {
			self.videos = [];
			$http.get(`${Constants.Api.GET_VIDEO_LIST}?p=${page}&${$scope.params}`)
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
