const TEMPLATE = `
	<div class="video-list">

		<video-list-item ng-repeat="video in $ctrl.videos" video="video"></video-list-item>

		<pagination 
		 	ng-if="$ctrl.showPagination"
			current-page="$ctrl.currentPage" 
			page-count="$ctrl.pageCount"
			get-data="$ctrl.getVideos"></pagination>

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

function controller ($http, Page, Constants) {
	var self = this;

	self.currentPage = 1;
	self.pageCount = 0;

	self.getVideos = getVideos;

	if (!self.videos) getVideos(self.currentPage);

	if (typeof self.showPagination === 'undefined') self.showPagination = true;

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
}
