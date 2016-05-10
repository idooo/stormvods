
const TEMPLATE = `
	<section class="tournament">

		<h1>Tournament: {{$ctrl.tournament.name}}</h1>

		<div ng-repeat="(stageCode, videos) in $ctrl.videos" ng-show="videos.length > 0">
			<h3 class="tournament__stage">{{stageCode}}</h3>
			<video-list-item ng-repeat="video in videos" video="video"></video-list-item>
		</div>

	</section>
`;

const GROUP_STAGE = [
	'GROUP',
	'GROUPA', 'GROUPAW', 'GROUPAL', 'GROUPAD',
	'GROUPB', 'GROUPBW', 'GROUPBL', 'GROUPBD',
	'GROUPC', 'GROUPD'
];
const PLAYOFF = [
	'RO64', 'RO32', 'RO16', 'LR1', 'WF', 'LF'
];
const QUARTERFINAL = 'QUARTERFINAL';
const SEMIFINAL = 'SEMIFINAL';
const FINAL = 'FINAL';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('tournamentPage', {
		template: TEMPLATE,
		controller: tournamentPage
	});

function tournamentPage ($http, $state, Page, Constants) {
	var self = this;

	self.videos = [];
	self.tournament = undefined;

	init();

	$http.get(`${Constants.Api.LOOKUP}/tournament?id=${$state.params.id}`)
		.then(response => {
			if (!response.data.values || !response.data.values.length) return notFound();
			self.tournament = response.data.values[0];
			Page.setTitle(self.tournament.name);
		})
		.catch(notFound);

	function init () {
		let url = `${Constants.Api.GET_VIDEO_LIST}?tournament=${$state.params.id}`;

		$http.get(url)
			.then(response => {
				self.videos = formatVideos(response.data.videos);
				Page.loaded();
			});
	}

	function notFound () {
		$state.go('error', {error: 'TOURNAMENT_NOT_FOUND'});
	}

	function formatVideos (data) {
		var stages = {
			'Group Stage': [],
			'Playoff': [],
			'Quaterfinals': [],
			'Semifinals': [],
			'Final': []
		};

		// TODO: fix this, it is so ugly
		data.forEach(video => {
			if (video.stage) {
				if (GROUP_STAGE.indexOf(video.stage.code) !== -1) stages['Group Stage'].push(video);
				else if (PLAYOFF.indexOf(video.stage.code) !== -1) stages['Playoff'].push(video);
				else {
					switch (video.stage.code) {
						case QUARTERFINAL:
							stages['Quaterfinals'].push(video);
							break;
						case SEMIFINAL:
							stages['Semifinals'].push(video);
							break;
						case FINAL:
							stages['Final'].push(video);
							break;
					}
				}
				video.stageCode = video.stage.code;
				video.stage = Constants.Stages[video.stage.code];
			}
		});
		stages['Group Stage'] = stages['Group Stage'].sort(getComparator(GROUP_STAGE));
		stages['Playoff'] = stages['Playoff'].sort(getComparator(GROUP_STAGE));

		return stages;
	}

	function getComparator (order) {
		return function getComparator (x, y) {
			return order.indexOf(x.stageCode) - order.indexOf(y.stageCode);
		};
	}
}
