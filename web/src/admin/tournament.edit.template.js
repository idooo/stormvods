module.exports = `
	<h2>Edit tournament</h2>
	
	<form name="$ctrl.form" novalidate ng-hide="$ctrl.isVideoUploading">

	
		<label>Name</label>
		<input type="text" ng-model="item.name" autocomplete="off">
		
		<label>Date (YYYY-MM)</label>
		<input type="text" ng-model="item.date" autocomplete="off">
			
		<label>Stage</label>
		<select ng-model="item.series">
			<option ng-repeat="option in series" value="{{option.code}}">
				{{option.name}}
			</option>
		</select>
		
		<label>masterleague.net ID</label>
		<input type="text" ng-model="item.masterleagueId" autocomplete="off">
		
		<label>HotsLogs ID</label>
		<input type="text" ng-model="item.hotslogsId" autocomplete="off">
		
		<label>Wiki Team Liquid URL</label>
		<input type="text" ng-model="item.teamLiquidWikiUrl" autocomplete="off">
		
		<button ng-click="updateTournament()">Update</button>
		
	</form>
		
	<div class="zone-popup-message" ng-if="message">{{message}}</div>
`;
