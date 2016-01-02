// list of constants

module.exports = {

	// Errors
	ERROR_INVALID: 'INVALID_VALUE',
	ERROR_DUPLICATE: 'DUPLICATE',
	ERROR_REDDIT_AUTH: 'REDDIT_AUTH_ERROR',
	ERROR_UNIQUE: 'EXPECTED_UNIQUE_VALUE',
	ERROR_NOT_FOUND: 'NOT_FOUND',
	ERROR_WRONG_ENTITY_ID: 'WRONG_ENTITY_ID',
	ERROR_REQUIRED: 'REQUIRED',
	ERROR_AUTH_REQUIRED: 'AUTH_REQUIRED',
	ERROR_ACCESS_DENIED: 'ACCESS_DENIED',
	ERROR_INTERNAL: 'INTERNAL_ERROR',
	ERROR_TYPE: 'WRONG_TYPE',
	ERROR_TIME_RESTRICTION: 'TIME_RESTRICTION',
	ERROR_VOTE_TWICE: 'VOTE_TWICE',
	ERROR_ALREADY_REMOVED: 'ALREADY_REMOVED',

	// things
	ROLES: {
		OPTIONAL: 1,
		USER: 2,
		MODERATOR: 5,
		ADMIN: 10
	},

	VIEW_MODES: {
		DEFAULT: 'DEFAULT',
		ONLY_REMOVED: 'ONLY_REMOVED',
		ALL: 'ALL'
	},
	
	TOP_MODES: {
		today: 'DAY1',
		week: 'DAY7',
		month: 'DAY30',
		alltime: 'ALLTIME'
	},

	// stages
	STAGE: [
		'FINAL',
		'SEMIFINAL',
		'QUARTERFINAL',
		'RO16',
		'RO32',
		'RO64',
		'GROUP',
		'GROUPA',
		'GROUPB',
		'GROUPC',
		'GROUPD',
		'QUALIFIER',
		'WB',
		'LB'
	],

	FORMAT: [
		'BO1',
		'BO3',
		'BO5',
		'BO7'
	],
	
	// entity types
	ENTITY_TYPES: [
		'video', 
		'tournament', 
		'teams', 
		'stage', 
		'format', 
		'casters'
	],
	// types with code instead of id
	ENTITY_TYPES_CODE: [
		'stage', 
		'format'
	]
};
