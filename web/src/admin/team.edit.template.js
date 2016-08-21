module.exports = `
	<h2>Edit Caster</h2>
	
	<form name="$ctrl.form" novalidate>
	
		<label>Name</label>
		<input type="text" ng-model="item.name" autocomplete="off">
		
		<label>Website</label>
		<input type="text" ng-model="item.website" autocomplete="off">
		
		<label>masterleague.net ID</label>
		<input type="text" ng-model="item.masterleagueId" autocomplete="off">
		
		<label>Wiki Team Liquid URL</label>
		<input type="text" ng-model="item.teamLiquidWikiUrl" autocomplete="off">
		
		<button ng-click="updateEntity()">Update</button>
		
	</form>
		
	<div class="zone-popup-message" ng-if="message">{{message}}</div>
`;
