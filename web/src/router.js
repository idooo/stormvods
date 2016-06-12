const DEFAULT_SIDEBAR = [
	'<addvideo-sidebar></addvideo-sidebar>',
	'<streamers-sidebar></streamers-sidebar>'
];

module.exports = function ($stateProvider) {

	$stateProvider
		.state('index', {
			url: '/',
			template: '<index-page/>'
		})
		.state('callback', {
			url: '/callback',
			views: {
				'': {template: '<callback-page/>'},
				'sidebar@': getEmptySidebar()
			}
		})
		.state('addvideo', {
			url: '/addvideo',
			views: {
				'': {template: '<add-video-page/>'},
				'sidebar@': {template: '<addvideo-rules-sidebar/>'}
			}
		})
		.state('video', {
			url: '/video/:id',
			template: '<video-page/>'
		})
		.state('tournament', {
			url: '/tournament/:id',
			views: {
				'': {template: '<tournament-page/>'},
				'sidebar@': getSidebarWithItem('<tournament-info-sidebar></tournament-info-sidebar>')
			}
		})
		.state('tournaments', {
			url: '/tournaments',
			template: '<tournaments-page/>'
		})
		.state('team', {
			url: '/team/:id',
			template: '<team-page/>'
		})
		.state('teams', {
			url: '/teams',
			template: '<teams-page/>'
		})
		.state('caster', {
			url: '/caster/:id',
			template: '<caster-page/>'
		})
		.state('casters', {
			url: '/casters',
			template: '<casters-page/>'
		})
		.state('top', {
			url: '/top/:mode',
			template: '<top-page/>'
		})
		.state('error', {
			url: '/error/:error',
			template: '<error-page/>'
		})
		.state('zone', {
			url: '/zone',
			views: {
				'': {template: '<zone-page/>'},
				'sidebar@': getEmptySidebar()
			}
		});
};

function getSidebarWithItem (item) {
	return {
		template: item + ' ' + DEFAULT_SIDEBAR.join(' ')
	};
}

function getEmptySidebar () {
	return {template: ' '};
}
