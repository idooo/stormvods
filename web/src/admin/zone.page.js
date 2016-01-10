/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('zonePage', zonePage);

const TEMPLATE = `
	<section>
		<h1>Zone</h1>
		
		<div>
			<h2>Users</h2>
			
			<table>
				<thead>
					<tr>Username</tr>
					<tr>Vote</tr>
					<tr>Videos added</tr>
					<tr>Videos updated</tr>
					<tr>Created</tr>
					<tr>Last Voted</tr>
					<tr>Last Created</tr>
					<tr>Removed?</tr>
					<tr>Banned?</tr>
				</thead>
				<tr ng-repeat="user in ctrl.users.users">
					<td>{{::user.name}}</td>
					<td>{{::user.stats.votes}}</td>
					<td>{{::user.stats.videosAdded}}</td>
					<td>{{::user.stats.videosUpdated}}</td>
					<td>{{::user.creationDate}}</td>
					<td>{{::user.lastVoteTime}}</td>
					<td>{{::user.lastCreateTime}}</td>
					<td>{{::user.isRemoved}}</td>
					<td>{{::user.isBanned}}</td>
				</tr>
			</table>
			
		</div>
		
	</section>
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
	
	function controller ($rootScope, $http, $state, Page, Constants) {
		var self = this;
		
		self.users = [];
		
		if (!$rootScope.username || $rootScope.role < Constants.Roles.ADMIN) return $state.go('index');
		
		Page.loaded();
		Page.setTitle('Zone'); 
		
		$http.get(`${Constants.Api.USERS}`).then(response => self.users = response.data);
	}
}
