/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('addVideoPage', addVideoPage);

const TEMPLATE = `
	<h1>Add new video link</h1>

	https://www.youtube.com/watch?v=1AwlsNfxYok
	<br>
	https://www.youtube.com/watch?v=-LsENvjLMxM
	
	<section class="add-video-page__section-add-video">
	
		<form name="ctrl.form" novalidate>

			<fieldset>
				<label>Link to video</label>
				
				<div class="field-container">
					<spinner ng-show="ctrl.isServerValidationInProgress"></spinner>
					<input 
						type="text" 
						name="url" 
						ng-model="ctrl.url" 
						ng-model-options="{ debounce: 1000 }"
						autocomplete="off" 
						required>
					<input type="hidden" name="youtubeId" ng-model="ctrl.youtubeId" required>
				</div>
				
				<div class="flash-alert" ng-show="ctrl.serverVideo.isFound">
					 This video is <a href="#" ui-sref="video({id: ctrl.serverVideo.id})">already uploaded</a>.
					 <br>
					 You can help <a href="#" ui-sref="video({id: ctrl.serverVideo.id})">improve</a>
					 its description or upload another one
				</div>
				
				<div class="flash-error" ng-show="ctrl.youtubeId == null">
					 Video URL looks wrong. Are you sure you are trying to add a correct link?
					 <br>
					 Please drop me a message if you think there is error in our side
				</div>
				
				<div ng-show="true || ctrl.serverVideo && !ctrl.serverVideo.isFound">
	
					<label>Tournament</label>
					
					<auto-complete model="ctrl.tournament" lookup="tournament" limit="1"></auto-complete>
		
					<label>Stage</label>	
					<select 
						ng-options="stage as stage.name for stage in ctrl.stages track by stage.code"
						ng-model="ctrl.stage"></select>
						
					<label>Teams</label>
					<auto-complete model="ctrl.teams" lookup="team" limit="2"></auto-complete>
		
					<label>Caster</label>
					<auto-complete model="ctrl.casters" lookup="caster" limit="5"></auto-complete>

				</div>
				
			</fields>
			
			<button 
				type="button" 
				ng-disabled="!ctrl.form.$valid || ctrl.serverVideo.isFound || ctrl.isServerValidationInProgress" 
				ng-click="ctrl.submit()" >
				
				Submit
			</button>

		</form>
	
	</section> 
		
`;

function addVideoPage () {

	return {
		restrict: 'E',
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	
	function controller ($scope, $http, $interval, Constants) {
		var self = this,
			serverValidationInterval;
		
		self.youtubeId = '';
		self.serverVideo = null;
		self.isServerValidationInProgress = false;

		self.submit = submit;
		self.stages = Constants.Stages;

		$scope.$watch('ctrl.url', function (newValue) {
			self.serverVideo = null;
			self.youtubeId = youtubeUrlParser(newValue);
			if (self.youtubeId) serverValidation();
		});

		function submit () {
			if (!self.form.$valid && !self.youtubeId) return;
			$http.post(Constants.Api.VIDEO, {
				youtubeId: self.youtubeId,
				tournament: self.tournament ? self.tournament[0] : null,
				stage: self.stage ? self.stage.code : null,
				teams: self.teams,
				casters: self.casters
			});
		}

		function youtubeUrlParser (url) {
			if (!url) return false;
			var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			return (match && match[1].length === 11) ? match[1] : null;
		}

		/**
		 * Validate youtube ID on the server side to prevent duplicates
		 */
		function serverValidation () {
			if (self.isServerValidationInProgress) {
				if (!serverValidationInterval) serverValidationInterval = $interval(serverValidation, 1000);
				return;
			}

			if (serverValidationInterval) {
				$interval.cancel(serverValidationInterval);
				serverValidationInterval = null;
			}
			self.isServerValidationInProgress = true;

			$http.get(`${Constants.Api.VALIDATE_VIDEO}?id=${self.youtubeId}`)
				.then((response) => {
					self.serverVideo = response.data;
				})
				.finally(() => self.isServerValidationInProgress = false);

		}

	}

}
