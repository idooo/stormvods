const PREFIX = '/api';

angular
	.module(`${window.APP_NAME}.common`)
	.constant('Constants', {

		Api: {
			PREFIX: PREFIX,
			AUTH_ME: `${PREFIX}/users/me`,
			USERS: `${PREFIX}/users`,
			USER: `${PREFIX}/user`,
			AUTH_GET_URL: `${PREFIX}/auth/url`,

			VIDEO: `${PREFIX}/video`,
			GET_VIDEO_LIST: `${PREFIX}/video/list`,
			GET_VIDEO_TOPLIST: `${PREFIX}/video/list/top`,
			GET_REMOVED_VIDEO_LIST: `${PREFIX}/video/removed`,
			VALIDATE_VIDEO: `${PREFIX}/video/validate`,

			LOOKUP: `${PREFIX}/lookup`,

			GET_TEAMS: `${PREFIX}/teams`,
			GET_TOURNAMENTS: `${PREFIX}/tournaments`,
			GET_CASTERS: `${PREFIX}/casters`,

			VOTE: `${PREFIX}/vote`,

			TWITCH_STREAMERS: `${PREFIX}/twitch/streamers`
		},

		Roles: {
			ADMIN: 10
		},

		Top: [
			{name: 'Today', code: 'today'},
			{name: 'Week', code: 'week'},
			{name: 'Month', code: 'month'},
			{name: 'All Time', code: 'alltime'}
		],

		Stages: {
			LR1: 'Losers\' Round 1',
			LR2: 'Losers\' Round 2',
			LR3: 'Losers\' Round 3',
			LF: 'Losers\' Final',
			WF: 'Winners\' Final',
			GROUP: 'Group Stage',
			GROUPA: 'Group A',
			GROUPB: 'Group B',
			GROUPC: 'Group C',
			GROUPD: 'Group D',
			GROUPAW: 'Group A. Winners Match',
			GROUPAL: 'Group A. Losers Match',
			GROUPAD: 'Group A. Decider Match',
			GROUPBW: 'Group B. Winners Match',
			GROUPBL: 'Group B. Losers Match',
			GROUPBD: 'Group B. Decider Match',
			GROUP2A: 'Second stage, group A',
			GROUP2B: 'Second stage, group B',
			GROUP2AW: 'Second stage, group A. Winners Match',
			GROUP2AL: 'Second stage, group A. Losers Match',
			GROUP2AD: 'Second stage, group A. Decider Match',
			GROUP2BW: 'Second stage, group B. Winners Match',
			GROUP2BL: 'Second stage, group B. Losers Match',
			GROUP2BD: 'Second stage, group B. Decider Match',
			RO32: 'Round of 32',
			RO16: 'Round of 16',
			QUARTERFINAL: 'Quarter final',
			SEMIFINAL: 'Semi final',
			FINAL: 'Final'
		},

		// For tournament page when we want to group matches
		// by stage type and sort matches inside the same stage
		StagesOrder: [
			{
				name: 'UNKNOWN',
				caption: 'Unknown',
				codes: []
			},
			{
				name: 'GROUP_STAGE',
				caption: 'Group Stage',
				codes: [
					'GROUP',
					'GROUPA', 'GROUPAW', 'GROUPAL', 'GROUPAD',
					'GROUPB', 'GROUPBW', 'GROUPBL', 'GROUPBD',
					'GROUPC', 'GROUPD'
				]
			},
			{
				name: 'GROUP_2_STAGE',
				caption: 'Second Group Stage',
				codes: [
					'GROUP2A', 'GROUP2AW', 'GROUP2AL', 'GROUP2AD',
					'GROUP2B', 'GROUP2BW', 'GROUP2BL', 'GROUP2BD'
				]
			},
			{
				name: 'PLAYOFF',
				caption: 'Playoff',
				codes: [
					'RO64', 'RO32', 'RO16', 'QUARTERFINAL', 'LR1',
					'SEMIFINAL', 'LR2', 'LR3', 'WF', 'LF'
				]
			},
			{
				name: 'FINAL',
				caption: 'Final',
				codes: ['FINAL']
			}
		],

		Formats: {
			BO1: 'Best of 1',
			BO3: 'Best of 3',
			BO5: 'Best of 5',
			BO7: 'Best of 7'
		},

		monthNames: [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		],

		tournamentSeries: [
			{name: 'Dreamhack', code: 'dh'},
			{name: 'HGC', code: 'hgc'},
			{name: 'GHL', code: 'ghl'},
			{name: 'Superleague', code: 'superleague'},
			{name: 'BlizzCon', code: 'blizzcon'},
			{name: 'Enter The Storm', code: 'ets'},
			{name: 'ZOTAC', code: 'zotac'},
			{name: 'Heroes of the Dorm', code: 'dorm'},
			{name: 'Go4', code: 'go4'}
		],

		Event: {
			TournamentSelectedEvent: 'TournamentSelectedEvent',
			TeamSelectedEvent: 'TeamSelectedEvent',
			CastersSelectedEvent: 'CastersSelectedEvent'
		}
	});
