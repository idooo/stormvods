/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('addVideoPage', addVideoPage);

const TEMPLATE = `
	<h1>Add new video link</h1>

	<section class="add-video-page__section-add-video">
	
		<form name="ctrl.form" novalidate ng-hide="ctrl.isVideoUploading">

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
				
				<div 
					ng-class="{
						'flash-alert': ctrl.serverVideo.isFound,
						'flash-error': ctrl.youtubeId == null
					}"
					ng-show="ctrl.serverVideo.isFound || ctrl.youtubeId == null">
					
					<span ng-show="ctrl.serverVideo.isFound">					
						This video is <a href="#" ui-sref="video({id: ctrl.serverVideo.id})">already uploaded</a>.
						<br>
						You can help <a href="#" ui-sref="video({id: ctrl.serverVideo.id})">improve</a>
						its description or upload another one
					</span>
					
					<span ng-show="ctrl.youtubeId == null">
						Video URL looks wrong. Are you sure you are trying to add a correct link?
						<br>
						Please drop me a message if you think there is error in our side
					</span>
				</div>
		
				<div ng-show="ctrl.serverVideo && !ctrl.serverVideo.isFound">
	
					<label>Tournament</label>
					
					<auto-complete model="ctrl.tournament" lookup="tournament" limit="1"></auto-complete>
		
					<label>Stage</label>	
					<select 
						ng-options="k as v for (k, v) in ctrl.stages"
						ng-model="ctrl.stage">
						<option value="{{k}}">{{v}}</option>
					</select>
					
					<label>Format</label>	
					<select 
						ng-options="k as v for (k, v) in ctrl.formats"
						ng-model="ctrl.format">
						<option value="{{k}}">{{v}}</option>
					</select>
						
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

const TITLE = 'Add VOD';

function addVideoPage () {

	return {
		restrict: 'E',
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($scope, $http, $interval, $timeout, $element, $state, Page, Constants) {
		var self = this,
			serverValidationInterval;
		
		self.youtubeId = '';
		self.serverVideo = null;
		self.isServerValidationInProgress = false;
		self.isVideoUploading = false;

		self.submit = submit;
		self.stages = Constants.Stages;
		self.formats = Constants.Formats;

		Page.loaded();
		Page.setTitle(TITLE);

		$scope.$watch('ctrl.url', function (newValue) {
			self.serverVideo = null;
			self.youtubeId = youtubeUrlParser(newValue);
			if (self.youtubeId) serverValidation();
		});

		function submit () {
			if (!self.form.$valid && !self.youtubeId) return;
			self.isVideoUploading = true;
			
			$http.post(Constants.Api.VIDEO, {
				youtubeId: self.youtubeId,
				tournament: self.tournament ? self.tournament[0] : null,
				stage: self.stage,
				format: self.format,
				teams: self.teams,
				casters: self.casters
			}).then(function (response) {
				$state.go('video', {id: response.data._id});
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
					
					// This is the hack to expand ui-select field to a whole width
					// Do not know how exactly this work
					if (!self.serverVideo.isFound) $timeout(() => {});
				})
				.finally(() => self.isServerValidationInProgress = false);

		}
	}
}
