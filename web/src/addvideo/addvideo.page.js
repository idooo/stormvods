const TEMPLATE = `
	<h1>Add new VOD</h1>

	<section class="add-video-page__section">

		<form name="$ctrl.form" novalidate ng-hide="$ctrl.isVideoUploading">

			<fieldset>

				<label>Link to video *</label>

				<video-urls urls="$ctrl.urls"></video-urls>

				<div>

					<label>Tournament *</label>

					<auto-complete model="$ctrl.tournament" lookup="tournament" limit="1"></auto-complete>

					<label>Stage</label>
					<select
						ng-options="k as v for (k, v) in $ctrl.stages"
						ng-model="$ctrl.stage">
						<option value="{{k}}">{{v}}</option>
					</select>

					<label>Format</label>
					<select
						ng-options="k as v for (k, v) in $ctrl.formats"
						ng-model="$ctrl.format">
						<option value="{{k}}">{{v}}</option>
					</select>

					<label>Teams *</label>
					<auto-complete model="$ctrl.teams" lookup="team" limit="2"></auto-complete>

					<label>Caster</label>
					<auto-complete model="$ctrl.casters" lookup="caster" limit="5"></auto-complete>

				</div>

				<button
					type="button"
					ng-disabled="!$ctrl.allVideosAreValid || !$ctrl.tournament.length || !$ctrl.teams.length || $ctrl.teams.length < 2"
					ng-click="$ctrl.submit()" >

					Submit
				</button>

				<div class="disclaimer">URL, tournament and both team names are required</div>

			</fieldset>

		</form>

		<div class="add-video-page__in-progress" ng-show="$ctrl.isVideoUploading">

			<div class="spinner"></div>
			<span>Please wait. We're carefully adding new video to our database</span>

		</div>

	</section>
`;

const TITLE = 'Add VOD';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('addVideoPage', {
		template: TEMPLATE,
		controller: addVideoPage
	});

function addVideoPage ($scope, $http, $state, Page, Constants) {
	var self = this;

	self.urls;
	self.stages = Constants.Stages;
	self.formats = Constants.Formats;
	self.allVideosAreValid = false;

	self.submit = submit;

	Page.loaded();
	Page.setTitle(TITLE);

	$scope.$watch('$ctrl.urls', function (urls) {
		if (!urls || !urls.length) return self.allVideosAreValid = false;

		if (urls.filter(i => i.youtubeId).length === 0) return self.allVideosAreValid = false;

		for (let i = 0; i < urls.length; i++) {
			if (urls[i].isValid === false || urls.isServerValidationInProgress) {
				return self.allVideosAreValid = false;
			}
		}
		self.allVideosAreValid = true;
	}, true);

	function submit () {
		if (!self.form.$valid && !self.allVideosAreValid) return;
		self.isVideoUploading = true;
		window.scrollTo(0, 0);

		$http.post(Constants.Api.VIDEO, {
				youtubeId: self.urls.map(i => i.youtubeId),
				tournament: self.tournament ? self.tournament[0] : null,
				stage: self.stage,
				format: self.format,
				teams: self.teams,
				casters: self.casters
			})
			.then(response => $state.go('video', {id: response.data._id}))
			.catch(response => {
				if (angular.isObject(response.data.message)) {
					response.data.message = JSON.stringify(response.data.message);
				}
				$state.go('error', {error: response.data.message});
			});
	}
}
