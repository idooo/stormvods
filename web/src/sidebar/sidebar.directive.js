angular
	.module(`${window.APP_NAME}.pages`)
	.directive('sidebar', sidebarDirective);

const TEMPLATE = `

	<section> 
		
		<h1>Add video</h1>	
		
		<div class="sidebar__add-video">
		
			<p>
				Heroes Video is an experiment to create 
				a community-driven spoiler-free catalog of vods for Heroes of the Storm.
			</p>
			<p>
				You can help by adding new video or improve information for added vods. 
			</p>
			
			<p>
				At least for now it will require Reddit account
			</p>
			
			<button ng-if="!$root.isAuthorised" ng-click="ctrl.openAuthUrl()">Login/Register</button>
			
			<button ng-if="$root.isAuthorised" ui-sref="addvideo">Add Video</button>
		
		</div>
	
	</section>	
	
`;

function sidebarDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller (Auth) {
		var self = this;
		
		self.openAuthUrl = Auth.openAuthUrl;
	}
}
