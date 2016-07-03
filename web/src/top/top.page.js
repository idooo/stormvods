const TITLE = 'Top';
const TEMPLATE = `
	<section>
		<h1>
			Top rated: {{$ctrl.mode.name}}
			<top-selector></top-selector>
		</h1>
		<video-list videos="$ctrl.videos" show-pagination="false"></video-list>
	</section>
`;

export class TopPage {

	constructor ($http, $state, Page, Constants) {

		this.videos = [];
		this.mode = Constants.Top[1]; // Week by default

		Constants.Top.forEach(top => {
			if ($state.params.mode === top.code) this.mode = top;
		});

		$http.get(`${Constants.Api.GET_VIDEO_TOPLIST}?mode=${this.mode.code}`)
			.then(response => {
				this.videos = response.data.videos.map(video => {
					if (video.stage) video.stage = Constants.Stages[video.stage.code];
					return video;
				});
				Page.loaded();
				Page.setTitle(TITLE);
			});
	}
}

export default {
	template: TEMPLATE,
	controller: TopPage
};
