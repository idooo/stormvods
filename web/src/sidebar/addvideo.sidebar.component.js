const TEMPLATE = `
	<section>
	
		<h1>Add video</h1>
	
		<div class="sidebar__block">
	
			<p>
				Storm Vods is an experiment to create
				a community-driven spoiler-free catalog of competitive videos
				for <a href="http://us.battle.net/heroes/en/">Heroes of the Storm</a> 
				game.
			</p>
			<p>
				You can help the community by adding
				new videos or improve information for existing vods.
			</p>
	
			<p>
				At least for now registration requires your Reddit account
				(no password)
			</p>
	
			<button ng-if="!$root.isAuthorised" ng-click="$ctrl.openAuthUrl()">
				Login/Register
			</button>
	
			<button ng-if="$root.isAuthorised" ui-sref="addvideo">
				Add Video
			</button>
	
		</div>
	
	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('addvideoSidebar', {
		template: TEMPLATE,
		controller: addvideoSidebarComponent
	});

function addvideoSidebarComponent (Auth) {
	var self = this;

	self.openAuthUrl = Auth.openAuthUrl;
}
