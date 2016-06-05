const TEMPLATE = `
	<div class="pagination">

		<button
			class="secondary"
			ng-disabled="$ctrl.currentPage <= 1"
			ng-click="$ctrl.getData($ctrl.currentPage-1)">
	
			&larr; Prev
		</button>
	
		<button
			class="secondary"
			ng-disabled="$ctrl.pageCount == $ctrl.currentPage"
			ng-click="$ctrl.getData($ctrl.currentPage + 1)">
	
			Next &rarr;
		</button>
	
	</div>
`;

angular
	.module(`${window.APP_NAME}.common`)
	.component('pagination', {
		bindings: {
			pageCount: '=',
			currentPage: '=',
			getData: '&'
		},
		template: TEMPLATE,
		controller: paginationComponent
	});

function paginationComponent () {
	var self = this;
	self.getData = self.getData();
}

