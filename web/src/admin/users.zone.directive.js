angular
	.module(`${window.APP_NAME}.pages`)
	.directive('usersZone', usersZoneDirective);

const TEMPLATE = `
	<div>
		<h2>Users</h2>
		
		<input class="zone-input" type="text" ng-model="ctrl.query">
		<input class="zone-input" type="text" ng-model="ctrl.sort">
		<button ng-click="ctrl.getUsers(ctrl.users.currentPage)">Update</button> 
		
		<table class="zone-table">
			<thead>
				<tr>
					<th width="150">Username</th>
					<th width="50">Votes</th>
					<th width="50">Videos added</th>
					<th width="50">Videos updated</th>
					<th>Account created</th>
					<th>Last voted</th>
					<th>Last created</th>
					<th width="50">Removed?</th>
					<th width="50">Banned?</th>
				</tr>
			</thead>
			<tr ng-repeat="user in ctrl.users.users" ng-class="{'even': $even}">
				<td>
					<span ng-click="isPopupVisible = !isPopupVisible">{{::user.name}}</span>
					<div class="zone-table__popup" ng-show="isPopupVisible">
						<pre>{{user.redditInfo}}</pre>
						<br>
						<a href="javascript:void(0)" ng-click="ctrl.toggleUserBan(user, !user.isBanned)">ban</a> 
						| 
						<a href="javascript:void(0)" ng-click="ctrl.toggleUserRemoval(user, !user.isRemoved)">remove</a>  
					</div>
				</td>
				<td>{{::user.stats.votes}}</td>
				<td>{{::user.stats.videosAdded}}</td>
				<td>{{::user.stats.videosUpdated}}</td>
				<td am-time-ago="user.creationDate"></td>
				<td am-time-ago="user.lastVoteTime"></td>
				<td am-time-ago="user.lastCreateTime"></td>
				<td>{{user.isRemoved}}</td>
				<td>{{user.isBanned}}</td>
			</tr>
		</table>
		
		<div class="pagination">
		
			<button 
				class="secondary" 
				ng-disabled="ctrl.users.currentPage <= 1"
				ng-click="ctrl.getUsers(ctrl.users.currentPage-1)">
				
				&larr; Prev
			</button>
			
			<button 
				class="secondary" 
				ng-disabled="ctrl.users.pageCount == ctrl.users.currentPage"
				ng-click="ctrl.getUsers(ctrl.users.currentPage+1)">
				
				Next &rarr;
			</button>
		
		</div>
		
	</div>
`;

function usersZoneDirective () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		replace: true,
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, Constants) {
		var self = this;
		
		self.query = '{}';
		self.sort = '{"_id": -1}';
		self.users = [];
		
		self.getUsers = getUsers;
		self.toggleUserBan = toggleUserBan;
		self.toggleUserRemoval = toggleUserRemoval;
		
		getUsers(1);
		
		function getUsers (page) {
			let url = `${Constants.Api.USERS}?p=${page}&query=${self.query}&sort=${self.sort}`;	
			self.users = [];
			$http.get(url).then(response => self.users = response.data);
		}
		
		function toggleUserBan (user, value) {
			$http.post(`${Constants.Api.USER}`, {id: user._id, isBanned: value});
			user.isBanned = value;
		}
		
		function toggleUserRemoval (user, value) {
			$http.post(`${Constants.Api.USER}`, {id: user._id, isRemoved: value});
			user.isRemoved = value;
		}
		
	}
}
