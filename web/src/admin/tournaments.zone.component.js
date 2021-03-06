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
				<td>{{item._id}}</td>
				<td>{{item.name}}</td>
				<td>{{item.series}}</td>
				<td>{{item.date | amDateFormat:'MMMM YYYY'}}</td>
				<td>{{item.author.name}}</td>
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
	getUrl: '/tournaments',
	mergeUrl: '/tournament/merge',
	updateUrl: '/tournament',
	fieldsToUpdate: ['date', 'name', 'series', 'masterleagueId', 'hotslogsId', 'teamLiquidWikiUrl'],
	template: require('./tournament.edit.template')
};

angular
	.module(`${window.APP_NAME}.pages`)
	.component('tournamentsZone', {
		template: TEMPLATE,
		controller: require('./abstract.zone.controller.factory')(CONFIGURATION)
	});

