const express = require('express');
const router = express.Router();

const {
    notFoundHandler,
    useChooseCityHandler,
    useAddRouteHandler,
    useGetPlacesHandler,
    useUploadImageHandler,
    useToggleLikeHandler,
} = require('./handlers');

const useGetCitiesHandler = require('./handlers/useGetCitiesHandler');
const useGetRoutesHandler = require('./handlers/useGetRoutesHandler');

function Router({ mediator, answer, common, uploads }) {
    router.get('/chooseCity/:city', useChooseCityHandler(mediator,answer) );
    router.get('/getCities',useGetCitiesHandler(mediator, answer) );
    router.get('/getRoutes', useGetRoutesHandler(mediator, answer) );
    router.get('/getPlaces', useGetPlacesHandler(mediator, answer) );
    router.post('/addRoute', useAddRouteHandler(mediator, answer) );
    router.post('/toggleLike', useToggleLikeHandler(mediator, answer) );
    router.post('/uploadImage', useUploadImageHandler(answer, common, uploads) );
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;