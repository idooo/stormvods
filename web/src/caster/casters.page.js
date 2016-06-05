const TEMPLATE = `
	<section class="entity-list">

		<h1>Casters</h1>

		<label>Filter</label>
		<input type="text" ng-model="filter" placeholder="eg. Khaldor" />

		<div
			ng-repeat="caster in $ctrl.casters | orderBy:'name' | filter:filter as results"
			class="entity-list__entity">
			<a href="#" ui-sref="caster({id: caster._id})">{{caster.name}}</a>
		</div>

		<pagination 
			current-page="$ctrl.currentPage" 
			page-count="$ctrl.pageCount"
			get-data="$ctrl.getCasters"></pagination>

	</section>
`;

const TITLE = 'Casters';

angular
	.module(`${window.APP_NAME}.pages`)
	.component('castersPage', {
		template: TEMPLATE,
		controller: castersPage
	});

function castersPage ($http, Page, Constants) {
	var self = this;

	self.casters = [];
	self.currentPage = 1;

	self.getCasters = getCasters;

	getCasters(self.currentPage);

	function getCasters (page) {
		self.casters = [];
		$http.get(`${Constants.Api.GET_CASTERS}?p=${page}`)
			.then(response => {
				self.currentPage = page;
				self.casters = response.data.items;
				self.pageCount = response.data.pageCount;
				Page.loaded();
				Page.setTitle(TITLE);
			});
	}

}
