const express = require('express');
const router = express.Router();

const {
    notFoundHandler,
    useLoginHandler,
    useUpdateChatHandler,
    useSendMessageHandler,
} = require('./handlers');

function Router({ mediator }) {
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;