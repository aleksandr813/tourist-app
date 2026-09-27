const CONFIG = {
    NAME: 'Express server',
    PORT: Number(process.env.PORT) || 3003,

    DATABASE: {
        NAME: 'data.db',
        DIR: process.env.DATABASE_DIR,
    },

    ROUTES: {
        PAGE_SIZE: 10,
        ALLOW_ANONYMOUS: process.env.ALLOW_ANONYMOUS_ROUTES === 'true',
        ANONYMOUS_AUTHOR_ID: 'anonymous',
    },

    AUTH: {
        BOT_TOKEN: process.env.BOT_TOKEN,
        INIT_DATA_MAX_AGE: 24 * 60 * 60,
    },

    UPLOADS: {
        DIR: 'uploads',
        MAX_FILE_SIZE: 5 * 1024 * 1024,
    },

    MEDIATOR: {
        EVENTS: {
            EXAMPLE_EVENT: 'EXAMPLE_EVENT',
            SELECT_CITY: 'SELECT_CITY',
            
        },
        TRIGGERS: {
            GET_CITIES: 'GET_CITIES',
            GET_ROUTES: 'GET_ROUTES',
            GET_PLACES: 'GET_PLACES',
            ADD_ROUTE: 'ADD_ROUTE',
            TOGGLE_LIKE: 'TOGGLE_LIKE',
            GET_ROUTE: 'GET_ROUTE',
            GET_USER_ID: 'GET_USER_ID',
            EXAMPLE_TRIGGER: 'EXAMPLE TRIGGER',
        },
    },
}

module.exports = CONFIG;