const express = require('express');
const router = express.Router();

const {
    useRegistrationHandler,
    notFoundHandler,
    useLoginHandler,
    useUpdateChatHandler,
    useSendMessageHandler,
} = require('./handlers');

function Router({ exampleManager }) {
    router.get('/reg/:username/:password', useRegistrationHandler(exampleManager));
    router.all('/*path', notFoundHandler);
    return router;
}

module.exports = Router;