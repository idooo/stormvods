angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videoPage', videoPage);

const TEMPLATE = `
		
	<h1>Video</h1>
	
	<video object="ctrl.video"></video>
	
`;

function videoPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $state, $sce, Constants) {
		var self = this;
		
		// TODO: if !$state.params.id -> not found page
		
		self.video = {};
		
		// TODO: handle 404
		
		$http.get(`${Constants.Api.VIDEO}/${$state.params.id}`)
			.then(response => {
				self.video = response.data;
			});
		
	}
		
}
