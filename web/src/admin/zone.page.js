/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('zonePage', zonePage);

const TEMPLATE = `
	<div>
		zone
		
		<table>
			<tr ng-repeat="video in ctrl.videos">
				<td width="100">
					<a href="#" ui-sref="video({id: video._id})">{{video.youtubeId || 'broken'}}</a>
				</td>
				<td width="100">
					<a href="#" ng-click="ctrl.remove(video._id)">Remove</a>
				</td>
				<td>
					<a href="#" ng-click="ctrl.remove(video._id, true)">Destroy</a>
				</td>
			</tr>
		</table>
	</div>
`;

function zonePage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, $state, Auth, Constants) {
		var self = this;
		
		if (!Auth.user.role || Auth.user.role < Constants.Roles.ADMIN) return $state.go('index'); 
		
		self.videos = [];
		
		self.remove = remove;
		
		$http.get(Constants.Api.GET_VIDEO_LIST)
			.then(response => self.videos = response.data);
			
		function remove (videoId, isPermanent) {
			
			$http
				.delete(`${Constants.Api.VIDEO}/${videoId}`, {
					data: {permanent: isPermanent}
				})
				.then(function () {
					for (var i = 0; i < self.videos.length; i++) {
						if (self.videos[i]._id === videoId) return self.videos.splice(i, 1);
					}
				});
		}
	}
		
}
