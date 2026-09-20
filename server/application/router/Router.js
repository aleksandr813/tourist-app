const express = require('express');
const router = express.Router();

const {
    notFoundHandler,
    chooseCityHandler,
} = require('./handlers');

function Router({ mediator }) {
    router.get('/chooseCity/:city', )
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;