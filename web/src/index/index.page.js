const TEMPLATE = `
	<section>

		<h1>
			Top rated today
			<top-selector></top-selector>
		</h1>

		<video object="$ctrl.today"></video>

	</section>

	<section>

		<h1>Recently added</h1>

		<video-list videos="$ctrl.videos"></video-list>

	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('indexPage', {
		template: TEMPLATE,
		controller: indexPage
	});

function indexPage ($http, Constants, Page) {
	var self = this;

	self.videos = [];
	self.currentPage = 1;
	self.pageCount = 1;

	var getList = $http.get(Constants.Api.GET_VIDEO_LIST)
		.then(response => {
			self.videos = response.data.videos.map(video => {
				if (video.stage) video.stage = Constants.Stages[video.stage.code];
				return video;
			});
			self.pageCount = response.data.pageCount;
		});

	var getTop = $http.get(`${Constants.Api.GET_VIDEO_TOPLIST}?mode=today`)
		.then(response => {
			self.today = response.data.videos[0];
		});

	Promise.all([getList, getTop])
		.then(Page.loaded)
		.catch(Page.loaded);
}

