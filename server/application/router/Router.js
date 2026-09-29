const express = require('express');
const router = express.Router();

const {
    useNotFoundHandler,
    useChooseCityHandler,
    useAddRouteHandler,
    useGetPlacesHandler,
    useUploadImageHandler,
    useToggleLikeHandler,
    useGetRouteHandler,
} = require('./handlers');

const useGetCitiesHandler = require('./handlers/useGetCitiesHandler');
const useGetRoutesHandler = require('./handlers/useGetRoutesHandler');

function Router({ mediator, answer, common, uploads }) {
    router.get('/chooseCity/:city', useChooseCityHandler(mediator,answer) );
    router.get('/getCities',useGetCitiesHandler(mediator, answer) );
    router.get('/getRoutes', useGetRoutesHandler(mediator, answer) );
    router.get('/routes/by-author', getRoutesByAuthor(mediator, answer));
    router.get('/getRoute', useGetRouteHandler(mediator, answer) );
    router.get('/getPlaces', useGetPlacesHandler(mediator, answer) );
    router.post('/addRoute', useAddRouteHandler(mediator, answer) );
    router.post('/toggleLike', useToggleLikeHandler(mediator, answer) );
    router.post('/uploadImage', useUploadImageHandler(answer, common, uploads) );
    router.all('/*path', useNotFoundHandler(answer));
    return router;
}

module.exports = Router;