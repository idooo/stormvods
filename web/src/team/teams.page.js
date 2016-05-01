angular
	.module(`${window.APP_NAME}.pages`)
	.directive('teamsPage', teamsPage);

const TEMPLATE = `
	<section class="entity-list">

		<h1>Teams</h1>

		<label>Filter</label>
		<input type="text" ng-model="filter" placeholder="eg. Cloud 9" />

		<div
			class="entity-list__entity entity-list__entity--team"
			ng-repeat="item in ctrl.items | orderBy:'name' | filter:filter as results">

			<img ng-src="/dist/images/teams/{{item.image || 'unknown.png'}}">
			<a href="#" ui-sref="team({id: item._id})">{{item.name}}</a>
		</div>

	</section>
`;

const TITLE = 'Teams';

function teamsPage () {

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

		$http.get(Constants.Api.GET_TEAMS)
			.then(response => {
				self.items = response.data.items;
				self.pageCount = response.data.pageCount;
				Page.loaded();
				Page.setTitle(TITLE);
			});
	}

}
