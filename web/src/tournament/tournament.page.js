const TEMPLATE = `
	<section class="tournament">

		<h1>Tournament: {{$ctrl.tournament.name}}</h1>

		<div ng-repeat="stage in $ctrl.videos" ng-show="$ctrl.videos.length > 0">
			<h3 class="tournament__stage" ng-hide="stage.name == 'Unknown'">{{stage.name}}</h3>
			<video-list-item ng-repeat="video in stage.videos" video="video"></video-list-item>
		</div>

	</section>
`;

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
				'Unknown': []
			},
			result = [];

		data.forEach(video => {
			var isStageFound = false;
			if (video.stage) {
				for (let stageCode in Constants.StagesOrder) {
					let stageName = Constants.StagesOrder[stageCode].caption;
					if (Constants.StagesOrder[stageCode].codes.indexOf(video.stage.code) !== -1) {
						isStageFound = true;
						if (!stages[stageName]) stages[stageName] = [];
						stages[stageName].push(video);
					}
				}
			}
			if (!isStageFound) stages['Unknown'].push(video);

			if (video.stage) {
				video.stageCode = video.stage.code;
			}
			video.stage = Constants.Stages[video.stageCode];
		});

		for (let i = 0; i < Constants.StagesOrder.length; i++) {
			let stageName = Constants.StagesOrder[i].caption;
			if (!stages[stageName] || stageName.length < 1) continue;
			stages[stageName] = stages[stageName].sort(getComparator(Constants.StagesOrder[i].codes));

			result.splice(i, 0, {
				name: stageName,
				videos: stages[stageName]
			});
		}

		return result;
	}

	function getComparator (order) {
		return function getComparator (x, y) {
			return order.indexOf(x.stageCode) - order.indexOf(y.stageCode);
		};
	}
}
