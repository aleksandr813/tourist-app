const express = require('express');
const router = express.Router();

const {
    notFoundHandler,
    useChooseCityHandler,
    useCreateRouteHandler,
} = require('./handlers');

const useGetCitiesHandler = require('./handlers/useGetCitiesHandler');
const useGetRoutesHandler = require('./handlers/useGetRoutesHandler');

function Router({ mediator, answer }) {
    router.get('/chooseCity/:city', useChooseCityHandler(mediator,answer) );
    router.get('/getCities',useGetCitiesHandler(mediator, answer) );
    router.get('/getRoutes', useGetRoutesHandler(mediator, answer) );
    router.post('/createRoute', useCreateRouteHandler(mediator, answer) );
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;