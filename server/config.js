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
            EXAMPLE_TRIGGER: 'EXAMPLE_TRIGGER',
            GET_CITIES: 'GET_CITIES',
        },
    },
}

module.exports = CONFIG;