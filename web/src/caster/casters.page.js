angular
	.module(`${window.APP_NAME}.pages`)
	.directive('castersPage', castersPage);

const TEMPLATE = `
	<section class="entity-list">

		<h1>Casters</h1>

		<label>Filter</label>
		<input type="text" ng-model="filter" placeholder="eg. Khaldor" />

		<div
			ng-repeat="item in ctrl.items | orderBy:'name' | filter:filter as results"
			class="entity-list__entity">
			<a href="#" ui-sref="caster({id: item._id})">{{item.name}}</a>
		</div>

	</section>
`;

const TITLE = 'Casters';

function castersPage () {

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

		$http.get(Constants.Api.GET_CASTERS)
			.then(response => {
				self.items = response.data.items;
				self.pageCount = response.data.pageCount;
				Page.loaded();
				Page.setTitle(TITLE);
			});
	}

}
