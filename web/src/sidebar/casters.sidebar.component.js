const TEMPLATE = `
	<section ng-if="$ctrl.isAdditionalDataAvailable">
	
		<h1>Casters</h1>
	
		<div class="sidebar__block">
	
			<p>
				Check other content from casters and show them you support 
				by following them on social media
			</p>
			
			<div ng-repeat="caster in $ctrl.casters">
			
				<ul>
					<li ng-if="caster.twitter">
						<img src="/dist/images/third-party/twitter.png">
						<a ng-href="https://twitter.com/{{caster.twitter}}">
							@{{caster.name}}
						</a>
					</li>
					<li ng-if="caster.youtube">
						<img src="/dist/images/third-party/youtube.png">
						<a ng-href="https://www.youtube.com/user/{{caster.youtube}}">
							{{caster.youtube}}
						</a>
					</li>
				</ul>
				
			</div>
		
		</div>
	
	</section>
`;

angular
	.module(`${window.APP_NAME}.pages`)
	.component('castersInfoSidebar', {
		template: TEMPLATE,
		controller: castersInfoSidebarComponent
	});

/**
 * @listens Constants.Event.CastersSelectedEvent
 */
function castersInfoSidebarComponent ($scope, Constants) {
	var self = this;

	self.casters = [];
	self.isAdditionalDataAvailable = false;

	$scope.$on(Constants.Event.CastersSelectedEvent, function (event, data) {
		self.casters = data.filter(casterInfo => casterInfo.twitter || casterInfo.youtube);
		self.isAdditionalDataAvailable = self.casters.length > 0;
	});
}
