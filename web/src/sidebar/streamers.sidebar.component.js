require('./streamers.service');

const TEMPLATE = `
	<section>
	
		<h2>Pro streams</h2>
	
		<div class="sidebar__block">
		
			<p>
				Links to professional players,
				casters and HOTS tournaments streams on Twitch
			</p>
		
			<span
				class="streamer-container"
			 	ng-class="{
					'streamer-container--offline': !streamer.isOnline,
					'streamer-container--online': streamer.isOnline
				}"
				ng-repeat="streamer in $ctrl.getStreamers()">
				
				<a href="https://www.twitch.tv/{{streamer.name}}">
					{{streamer.name}}
				</a> 
			</span>
			
		</div>
	
	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('streamersSidebar', {
		template: TEMPLATE,
		controller: streamersSidebarComponent
	});

function streamersSidebarComponent (Streamers) {
	var self = this;
	self.getStreamers = Streamers.get;
}
