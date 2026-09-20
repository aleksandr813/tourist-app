const express = require('express');
const router = express.Router();

const {
    notFoundHandler,
    useChooseCityHandler,
    useGetCitiesHandler
} = require('./handlers');
const useGetCitiesHandler = require('./handlers/useGetCitiesHandler');

function Router({ mediator, answer }) {
    router.get('/chooseCity/:city', useChooseCityHandler(mediator,answer) );
    router.get('/getCities',useGetCitiesHandler(mediator, answer) );
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;