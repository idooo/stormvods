const TEMPLATE = `
	<div>
		<h2>Users</h2>

		<input class="zone-input" type="text" ng-model="$ctrl.query">
		<input class="zone-input" type="text" ng-model="$ctrl.sort">
		<button ng-click="$ctrl.getUsers($ctrl.users.currentPage)">Update</button>

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
				</tr>
			</thead>
			<tr ng-repeat="user in $ctrl.users.users" ng-class="{'even': $even}">
				<td>
					<span ng-click="isPopupVisible = !isPopupVisible">{{::user.name}}</span>
					<div class="zone-table__popup" ng-show="isPopupVisible">
						<pre>{{user.redditInfo}}</pre>
					</div>
				</td>
				<td>{{::user.stats.votes}}</td>
				<td>{{::user.stats.videosAdded}}</td>
				<td>{{::user.stats.videosUpdated}}</td>
				<td am-time-ago="user.creationDate"></td>
				<td am-time-ago="user.lastVoteTime"></td>
				<td am-time-ago="user.lastCreateTime"></td>
				<td>
					<a href="javascript:void(0)"
					   ng-click="$ctrl.toggleRemoval(user, !user.isRemoved)">{{user.isRemoved}}</a>
				</td>
			</tr>
		</table>

		<div class="pagination">

			<button
				class="secondary"
				ng-disabled="$ctrl.users.currentPage <= 1"
				ng-click="$ctrl.getUsers($ctrl.users.currentPage-1)">

				&larr; Prev
			</button>

			<button
				class="secondary"
				ng-disabled="$ctrl.users.pageCount == $ctrl.users.currentPage"
				ng-click="$ctrl.getUsers($ctrl.users.currentPage+1)">

				Next &rarr;
			</button>

		</div>

	</div>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('usersZone', {
		template: TEMPLATE,
		controller: usersZoneComponent
	});

function usersZoneComponent ($http, Constants) {
	var self = this;

	self.query = '{}';
	self.sort = '{"_id": -1}';
	self.users = [];

	self.getUsers = getUsers;
	self.toggleRemoval = toggleRemoval;

	getUsers(1);

	function getUsers (page) {
		let url = `${Constants.Api.USERS}?p=${page}&query=${self.query}&sort=${self.sort}`;
		self.users = [];
		$http.get(url).then(response => self.users = response.data);
	}

	function toggleRemoval (user, value) {
		$http.put(`${Constants.Api.USER}`, {id: user._id, update: {isRemoved: value}});
		user.isRemoved = value;
	}
}
