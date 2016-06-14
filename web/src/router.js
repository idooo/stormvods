const SIDEBAR = {
	ADDVIDEO: '<addvideo-sidebar></addvideo-sidebar>',
	ADDVIDEO_RULES: '<addvideo-rules-sidebar></addvideo-rules-sidebar>',
	STREAMERS: '<streamers-sidebar></streamers-sidebar>',
	TOURNAMENT: '<tournament-info-sidebar></tournament-info-sidebar>',
	CASTERS: '<casters-info-sidebar></casters-info-sidebar>',
	EMPTY: {template: ' '}
};

const DEFAULT_SIDEBAR = [
	SIDEBAR.ADDVIDEO,
	SIDEBAR.STREAMERS
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
				'sidebar@': SIDEBAR.EMPTY
			}
		})
		.state('addvideo', {
			url: '/addvideo',
			views: {
				'': {template: '<add-video-page/>'},
				'sidebar@': {template: SIDEBAR.ADDVIDEO_RULES}
			}
		})
		.state('video', {
			url: '/video/:id',
			views: {
				'': {template: '<video-page/>'},
				'sidebar@': getSidebarWithItems([
					SIDEBAR.TOURNAMENT,
					SIDEBAR.CASTERS
				])
			}
		})
		.state('tournament', {
			url: '/tournament/:id',
			views: {
				'': {template: '<tournament-page/>'},
				'sidebar@': getSidebarWithItem(SIDEBAR.TOURNAMENT)
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
			views: {
				'': {template: '<caster-page/>'},
				'sidebar@': getSidebarWithItem(SIDEBAR.CASTERS)
			}
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
				'sidebar@': SIDEBAR.EMPTY
			}
		});
};

function getSidebarWithItem (item) {
	return {
		template: item + ' ' + DEFAULT_SIDEBAR.join(' ')
	};
}

function getSidebarWithItems (items) {
	return {
		template: items.join(' ') + ' ' + DEFAULT_SIDEBAR.join(' ')
	};
}
