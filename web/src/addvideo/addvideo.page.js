/* global angular */

angular
	.module(`${window.APP_NAME}.pages`)
	.directive('addVideoPage', addVideoPage);

const TEMPLATE = `
	<h1>Add video page</h1>
	
	<section class="add-video-page__section-add-video">
		<add-video></add-video>
	</section>
`;

function addVideoPage () {

	return {
		restrict: 'E',
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
