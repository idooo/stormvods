const TEMPLATE = `
	<div>
		<h2>Tournaments</h2>

		<input placeholder='eg {"name": {"$regex": ".*dream.*", "$options": "i"}}' 
			class="zone-input" type="text" ng-model="$ctrl.query">
		<input class="zone-input" type="text" ng-model="$ctrl.sort">
		
		<button ng-click="$ctrl.getData()">Update</button>

		<table class="zone-table">
			<thead>
				<tr>
					<th width="40">id</th>
					<th>Name</th>
					<th>Series</th>
					<th>Date</th>
					<th>Author</th>
					<th>Creation Date</th>
					<th></th>
				</tr>
			</thead>
			<tr ng-repeat="item in $ctrl.data.items" ng-class="{'even': $even}">
				<td>{{::item._id}}</td>
				<td>{{::item.name}}</td>
				<td>{{::item.series}}</td>
				<td>{{::item.date | amDateFormat:'MMMM YYYY'}}</td>
				<td>{{::item.author.name}}</td>
				<td am-time-ago="item.creationDate"></td>
				<td><span ng-click="$ctrl.openEditPopup(item)">Edit</span></td>
			</tr>
		</table>

		<h2>Actions</h2>

		<div>
			<h3>Merge</h3>
			<input class="zone-input" type="text" ng-model="mergeFromId" placeholder="Source ID">
			<input class="zone-input" type="text" ng-model="mergeToId" placeholder="Target ID">
			<button ng-click="$ctrl.merge(mergeFromId, mergeToId)">Merge</button>
		</div>
	</div>
`;

const FIELDS_TO_UPDATE = [
	'date', 'name', 'series', 'masterleagueId', 'hotslogsId', 'teamLiquidWikiUrl'
];

angular
	.module(`${window.APP_NAME}.pages`)
	.component('tournamentsZone', {
		template: TEMPLATE,
		controller: tournamentsZone
	});

function tournamentsZone ($http, ngDialog, Constants) {
	var self = this;

	self.data = {};
	self.query = '{}';
	self.sort = '{"_id": -1}';

	self.getData = getData;
	self.merge = merge;
	self.openEditPopup = openEditPopup;

	getData();

	function getData () {
		let url = `${Constants.Api.PREFIX}/tournaments?query=${self.query}&sort=${self.sort}`;
		self.data = {};
		$http.get(url).then(response => self.data = response.data);
	}

	function merge (src, target) {
		$http
			.post(`${Constants.Api.PREFIX}/tournament/merge`, {
				src,
				target
			})
			.catch(e => alert(e)); // eslint-disable-line no-alert
	}

	function openEditPopup (item) {
		const TEMPLATE = require('./tournament.edit.template');

		ngDialog.open({
			template: TEMPLATE,
			plain: true,
			controller: function ($scope, $http, Constants) {
				var origItem = JSON.parse(JSON.stringify(item));

				$scope.item = item;
				$scope.series = Constants.tournamentSeries;
				$scope.message = '';
				$scope.updateTournament = updateTournament;

				function updateTournament () {
					// Compare existing data with new
					var data = {};
					FIELDS_TO_UPDATE.forEach(key => {
						if (origItem[key] !== $scope.item[key]) {
							data[key] = $scope.item[key];
						}
					});
					if (data.date) data.date = new Date(data.date);

					// exit if nothing changed
					if (!Object.keys(data).length) {
						return $scope.message = 'Nothing to change';
					}

					$http
						.put(`${Constants.Api.PREFIX}/tournament`, {
							id: item._id,
							update: data
						})
						.then(() => {
							$scope.message = 'Tournament has been updated';
							ngDialog.close();
						})
						.catch(err => $scope.message = JSON.stringify(err));

				}
			}
		});
	}
}


