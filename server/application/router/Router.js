const express = require('express');
const router = express.Router();

const {
    notFoundHandler,
    useChooseCityHandler,
} = require('./handlers');

function Router({ mediator, answer }) {
    router.get('/chooseCity/:city', useChooseCityHandler(mediator,answer) );
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;