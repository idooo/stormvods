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

		<h2>Actions</h2>

		<div>
			<h3>Rename</h3>
			<input class="zone-input" type="text" ng-model="renameId" placeholder="ID">
			<input class="zone-input" type="text" ng-model="renameNewName" placeholder="New name">
			<button ng-click="ctrl.rename(renameId, renameNewName)">Rename</button>
		</div>

		<div>
			<h3>Merge</h3>
			<input class="zone-input" type="text" ng-model="mergeFromId" placeholder="Source ID">
			<input class="zone-input" type="text" ng-model="mergeToId" placeholder="Target ID">
			<button ng-click="ctrl.merge(mergeFromId, mergeToId)">Merge</button>
		</div>
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
		self.entityType = ENTITY_TYPES[1];
		self.entityTypes = ENTITY_TYPES;

		self.getData = getData;
		self.rename = rename;
		self.merge = merge;

		getData();

		function getData () {
			let url = `${Constants.Api.PREFIX}/${self.entityType}`;
			self.data = {};
			$http.get(url).then(response => self.data = response.data);
		}

		function rename (id, newName) {
			$http
				.put(`${Constants.Api.PREFIX}/${self.entityType.slice(0, -1)}`, {
					id,
					update: {name: newName}
				})
				.catch(e => alert(e)); // eslint-disable-line no-alert
		}

		function merge (src, target) {
			$http
				.post(`${Constants.Api.PREFIX}/${self.entityType.slice(0, -1)}/merge`, {
					src,
					target
				})
				.catch(e => alert(e)); // eslint-disable-line no-alert
		}
	}
}
