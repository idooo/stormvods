angular
	.module(`${window.APP_NAME}.pages`)
	.directive('videoPage', videoPage);

const TEMPLATE = `
	<div>
		
		video page
		
		<video object="ctrl.video"></video>
		
	</div>
`;

function videoPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
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
