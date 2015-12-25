angular
	.module(`${window.APP_NAME}.pages`)
	.directive('tournamentsPage', tournamentsPage);

const TEMPLATE = `
	<section>
		
		<h1>Tournaments</h1>
		
		<input type="text" ng-model="filter" />
		
		<div ng-repeat="item in ctrl.items | filter:filter as results">
			<a href="#" ui-sref="tournament({id: item._id})">{{item.name}}</a>
		</div>	
		
	</section>
`;

function tournamentsPage () {

	return {
		restrict: 'E',
		controllerAs: 'ctrl',
		scope: true,
		template: TEMPLATE,
		controller: controller
	};
	
	function controller ($http, Page, Constants) {
		var self = this;
		
		self.items = [];
		self.currentPage = 1;
		self.pageCount = 1;
		
		$http.get(Constants.Api.GET_TOURNAMENTS)
			.then(response => {
				self.items = response.data.items;
				self.pageCount = response.data.pageCount;
				Page.loaded();
			});
	}
		
}
