/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('addVideoPage', addVideoPage);

const TEMPLATE = `
	<div class="page add-video-page">
		<h1>Add video page</h1>
		
		<section class="add-video-page__section-add-video">
			<add-video></add-video>
		</section>
	</div>
`;

function addVideoPage () {

	return {
		restrict: 'E',
		replace: true,
		scope: true,
		template: TEMPLATE,
		link: link,
		controller: controller
	};
	
	function link () {

	}
	
	function controller () {
		
	}
		
}
