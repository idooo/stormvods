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

export class IndexPage {

	constructor ($http, Constants, Page) {

		this.videos = [];
		this.currentPage = 1;
		this.pageCount = 1;

		let getList = $http.get(Constants.Api.GET_VIDEO_LIST)
			.then(response => {
				this.videos = response.data.videos.map(video => {
					if (video.stage) video.stage = Constants.Stages[video.stage.code];
					return video;
				});
				this.pageCount = response.data.pageCount;
			});

		let getTop = $http.get(`${Constants.Api.GET_VIDEO_TOPLIST}?mode=today`)
			.then(response => {
				this.today = response.data.videos[0];
			});

		Promise.all([getList, getTop])
			.then(Page.loaded)
			.catch(Page.loaded);
	}
}

export default {
	template: TEMPLATE,
	controller: IndexPage
};
