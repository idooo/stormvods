angular
	.module(`${window.APP_NAME}.pages`)
	.directive('entitiesZone', entitiesZoneDirective);

const TEMPLATE = `
	<div>
		<h2>Entities</h2>

		<select ng-model="ctrl.entityType" ng-options="type as type for type in ctrl.entityTypes">
		</select>

		<input class="zone-input" type="text" ng-model="ctrl.query">
		<input class="zone-input" type="text" ng-model="ctrl.sort">
		<button ng-click="ctrl.getData()">Update</button>

		<table class="zone-table">
			<thead>
				<tr>
					<th width="50">id</th>
					<th>Name</th>
					<th>Author</th>
					<th>Creation Date</th>
				</tr>
			</thead>
			<tr ng-repeat="item in ctrl.data.items" ng-class="{'even': $even}">
				<td>{{::item._id}}</td>
				<td>{{::item.name}}</td>
				<td>{{::item.author.name}}</td>
				<td am-time-ago="item.creationDate"></td>
			</tr>
		</table>
	</div>
`;

// entity types
const ENTITY_TYPES = [
	'tournaments',
	'teams',
	'casters'
];

function entitiesZoneDirective () {

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

		self.data = {};
		self.query = '{}';
		self.sort = '{"_id": -1}';
		self.entityType = ENTITY_TYPES[0];
		self.entityTypes = ENTITY_TYPES;

		self.getData = getData;

		getData();

		function getData () {
			let url = `${Constants.Api.PREFIX}/${self.entityType}`;
			self.data = {};
			$http.get(url).then(response => self.data = response.data);
		}

	}
}
