angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videoPage', videoPage);

const TEMPLATE = `
	<section>
			
		<h1>Video</h1>
	
		<video object="ctrl.video"></video>
		
		<improve-video 
			type="tournament"
			video="ctrl.video" 
			info="ctrl.additionalInfo">
		</improve-video>
		
		<improve-video 
			type="stage"
			video="ctrl.video" 
			info="ctrl.additionalInfo">
		</improve-video>
		
		<improve-video 
			type="format"		
			video="ctrl.video" 
			info="ctrl.additionalInfo">
		</improve-video>
		
		<improve-video 
			type="teams"
			video="ctrl.video" 
			info="ctrl.additionalInfo">
		</improve-video>
		
		<improve-video 
			type="casters"
			video="ctrl.video" 
			info="ctrl.additionalInfo">
		</improve-video>
		
		
	</section>
`;

function videoPage () {

	return {
		restrict: 'E',
		scope: true,
		template: TEMPLATE,
		controller: controller,
		controllerAs: 'ctrl'
	};
	
	function controller ($http, $state, $sce, Page, Constants) {
		var self = this;
		
		// TODO: if !$state.params.id -> not found page
		
		self.video = {};
		self.additionalInfo = {};
		
		// TODO: handle 404
		
		$http.get(`${Constants.Api.VIDEO}/${$state.params.id}`)
			.then(response => {
				self.video = response.data;
				Page.loaded();
			});
			
		$http.get(`${Constants.Api.VIDEO}/${$state.params.id}/info`)
			.then(response => {
				self.additionalInfo = response.data;
			});
		
	}
		
}
