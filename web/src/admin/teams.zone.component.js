const TEMPLATE = `
	<div>
		<h2>Teams</h2>

		<input placeholder='eg {"name": {"$regex": ".*dream.*", "$options": "i"}}' 
			class="zone-input" type="text" ng-model="$ctrl.query">
		<input class="zone-input" type="text" ng-model="$ctrl.sort">
		
		<button ng-click="$ctrl.getData()">Update</button>

		<table class="zone-table">
			<thead>
				<tr>
					<th width="40">id</th>
					<th>Name</th>
					<th>Creation Date</th>
					<th></th>
				</tr>
			</thead>
			<tr ng-repeat="item in $ctrl.data.items" ng-class="{'even': $even}">
				<td>{{item._id}}</td>
				<td>{{item.name}}</td>
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

const CONFIGURATION = {
	getUrl: '/teams',
	mergeUrl: '/team/merge',
	updateUrl: '/team',
	fieldsToUpdate: ['name', 'masterleagueId', 'website', 'teamLiquidWikiUrl'],
	template: require('./team.edit.template')
};

angular
	.module(`${window.APP_NAME}.pages`)
	.component('teamsZone', {
		template: TEMPLATE,
		controller: require('./abstract.zone.controller.factory')(CONFIGURATION)
	});

