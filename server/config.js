const CONFIG = {
    NAME: 'Express server',
    PORT: 3003,

    DATABASE: {
        NAME: 'data.db',
    },

    ROUTES: {
        PAGE_SIZE: 10,
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
            EXAMPLE_TRIGGER: 'EXAMPLE TRIGGER',
        },
    },
}

module.exports = CONFIG;