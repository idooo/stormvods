const LAST_COMMA = /,(?!.*?,)/;

module.exports = {
	
	tournament: {
		questionCorrectness: {
			message: 'Is this vod from',
			func: (video) => video.tournament.name
		},
		suggestion: {
			message: 'Is it from',
			func: (info) => info.tournament.length ? info.tournament[0].name : ''
		},
		questionLookup: {
			lookup: 'tournament',
			message: 'From what tournament',
			limit: 1
		}
	},
	
	teams: {
		questionCorrectness: {
			message: 'Is this a game between',
			func: (video) => video.teams.teams[0].name + ' and ' + video.teams.teams[1].name
		},
		suggestion: {
			message: 'Is it between',
			func: (info) => info.teams.length ? info.teams[0].teams[0].name + ' and ' + info.teams[0].teams[1].name : ''
		},
		questionLookup: {
			message: 'What teams are fighting there',
			lookup: 'team',
			limit: 2
		}
	},
	
	casters: {
		questionCorrectness: {
			message: 'Is this a game casted by',
			func: (video) => video.casters.casters.map(i => i.name).join(', ').replace(LAST_COMMA, ' and')
		},
		suggestion: {
			message: 'Is it casted by',
			func: (info) => info.casters.length ? info.casters[0].casters.map(i => i.name).join(', ').replace(LAST_COMMA, ' and') : ''
		},
		questionLookup: {
			message: 'Who casted this game',
			lookup: 'caster',
			limit: 5
		}
	},
	
	stage: {
		questionCorrectness: {
			message: 'Is this a',
			func: (video) => video.stage.code
		},
		suggestion: {
			message: 'Is it',
			func: (info) => info.stage.length ? info.stage[0].code : ''
		},
		questionLookup: {
			message: 'What stage is it?',
			isSelect: true,
			options: constants => constants.Stages
		}
	},
	
	format: {
		questionCorrectness: {
			message: 'Is this a',
			func: (video) => video.format.code
		},
		suggestion: {
			message: 'Is it',
			func: (info) => info.format.length ? info.format[0].code : ''
		},
		questionLookup: {
			message: 'What format is it?',
			isSelect: true,
			options: constants => constants.Formats
		}
	}
};
