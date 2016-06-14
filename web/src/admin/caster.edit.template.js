module.exports = `
	<h2>Edit Caster</h2>
	
	<form name="$ctrl.form" novalidate>
	
		<label>Name</label>
		<input type="text" ng-model="item.name" autocomplete="off">
		
		<label>Twitter @nickname</label>
		<input type="text" ng-model="item.twitter" autocomplete="off">
		
		<label>Youtube ID</label>
		<input type="text" ng-model="item.youtube" autocomplete="off">
		
		<button ng-click="updateEntity()">Update</button>
		
	</form>
		
	<div class="zone-popup-message" ng-if="message">{{message}}</div>
`;
