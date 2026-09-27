const CONFIG = {
    NAME: 'Express server',
    PORT: 3003,

    DATABASE: {
        NAME: 'data.db',
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
            EXAMPLE_TRIGGER: 'EXAMPLE TRIGGER',
        },
    },
}

module.exports = CONFIG;