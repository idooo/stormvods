angular
	.module(`${window.APP_NAME}.pages`)
	.directive('addVideoPage', addVideoPage);

const TEMPLATE = `
	<h1>Add new VOD</h1>

	<section>
	
		<form name="ctrl.form" novalidate ng-hide="ctrl.isVideoUploading">

			<fieldset>
				<label>Link to video</label>
					
				<video-urls urls="ctrl.urls" class="add-video-page__video-urls"></video-urls>
		
				<div>
	
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
				ng-disabled="!ctrl.allVideosAreValid" 
				ng-click="ctrl.submit()" >
				
				Submit
			</button>

		</form>
	
	</section> 
`;

// TODO: Handle server errors

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
		var self = this;
		
		self.urls;
		self.stages = Constants.Stages;
		self.formats = Constants.Formats;
		self.allVideosAreValid = false;

		self.submit = submit;

		Page.loaded();
		Page.setTitle(TITLE);
		
		$scope.$watch('ctrl.urls', function (urls) {
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
			
			$http.post(Constants.Api.VIDEO, {
				youtubeId: self.urls.map(i => i.youtubeId),
				tournament: self.tournament ? self.tournament[0] : null,
				stage: self.stage,
				format: self.format,
				teams: self.teams,
				casters: self.casters
			}).then(function (response) {
				$state.go('video', {id: response.data._id});
			});
		}

	}
}
