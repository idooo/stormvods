const TEMPLATE = `
	<div class="video-list">

		<div
			class="video-list-item"
			ng-repeat="video in $ctrl.videos">

			<rating video="video"></rating>

			<div
				class="video-list-item__info"
				ui-sref="video({id: video._id})">

				<span class="video-list-item__tournament">
					{{video.tournament.name || 'Mysterious match'}}
				</span>

				<span class="video-list-item__stage" ng-if="video.stage">
					{{video.stage }}
				</span>

				<span class="video-list-item__time" am-time-ago="video.creationDate"></span>

			</div>

			<div
				class="video-list-item__teams"
				ng-show="$ctrl.isTeamVisible || video.isTeamVisible"
				ui-sref="video({id: video._id})">

				<div class="video-list-item__team-name">
					{{video.teams.teams[0].name}}
				</div>
				<div class="video-list-item__team-logo">
					<img ng-src="/dist/images/teams/{{video.teams.teams[0].image || 'unknown.png'}}">
				</div>
				<div class="vs">vs</div>
				<div class="video-list-item__team-logo">
					<img ng-src="/dist/images/teams/{{video.teams.teams[1].image || 'unknown.png'}}">
				</div>
				<div class="video-list-item__team-name">
					{{video.teams.teams[1].name}}
				</div>

			</div>


			<div class="video-list-item__delimiter">
				<div
					class="video-list-item__show-teams"
					ng-hide="$ctrl.isTeamVisible || video.isTeamVisible">
					<span ng-click="video.isTeamVisible = true; $event.stopPropagation();">Show Teams</span>
				</div>
			</div>

		</div>

		<div class="pagination" ng-if="$ctrl.showPagination">

			<button
				class="secondary"
				ng-disabled="$ctrl.currentPage <= 1"
				ng-click="$ctrl.getVideos($ctrl.currentPage-1)">

				&larr; Prev
			</button>

			<button
				class="secondary"
				ng-disabled="$ctrl.pageCount == $ctrl.currentPage"
				ng-click="$ctrl.getVideos($ctrl.currentPage+1)">

				Next &rarr;
			</button>

		</div>

	</div>
`;

angular
	.module(`${window.APP_NAME}.common`)
	.component('videoList', {
		bindings: {
			params: '=?',
			showPagination: '=?',
			videos: '=?',
			pageLoad: '@'
		},
		template: TEMPLATE,
		controller: controller
	});

function controller ($rootScope, $http, Page, Constants) {
	var self = this;

	self.currentPage = 1;
	self.pageCount = 0;
	self.isTeamVisible = $rootScope.isTeamVisible;

	self.getVideos = getVideos;
	self.showTeams = showTeams;

	if (!self.videos) getVideos(self.currentPage);

	if (typeof self.showPagination === 'undefined') self.showPagination = true;

	$rootScope.$watch('isTeamVisible', (newValue, oldValue) => {
		if (typeof newValue === 'boolean' && newValue !== oldValue) self.isTeamVisible = newValue;
	});

	function getVideos (page) {
		let url = `${Constants.Api.GET_VIDEO_LIST}?p=${page}`;
		if (self.params) url += `&${self.params}`;

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
