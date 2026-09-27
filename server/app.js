const express = require('express');
const app = express();
const cors = require('cors');
const CONFIG = require('./config');
const Router = require('./application/router/Router');
const { useErrorHandler } = require('./application/router/handlers');
const Answer = require('./application/Answer');
const DB = require('./application/modules/db/DB');
const Common = require('./application/modules/Common/Common');
const Mediator = require('./application/modules/Mediator/Mediator');
const RoutesManager = require('./application/modules/routes/RoutesManager');
const AuthManager = require('./application/modules/auth/AuthManager');

const { NAME, PORT, DATABASE, UPLOADS, ROUTES, AUTH } = CONFIG;

const db = new DB({ DATABASE });
const mediator = new Mediator(CONFIG.MEDIATOR);
const answer = new Answer();
const common = new Common();

new AuthManager({
    mediator,
    db,
    common,
    botToken: AUTH.BOT_TOKEN,
    initDataMaxAge: AUTH.INIT_DATA_MAX_AGE,
});
new RoutesManager({
    mediator,
    db,
    common,
    pageSize: ROUTES.PAGE_SIZE,
    anonymousAuthorId: ROUTES.ALLOW_ANONYMOUS ? ROUTES.ANONYMOUS_AUTHOR_ID : null,
});
app.use(cors());
app.use(express.json());


const router = new Router({
    mediator,
    answer,
    common,
    uploads: { ...UPLOADS, PATH: `${__dirname}/public/${UPLOADS.DIR}` },
});

app.use(express.static(`${__dirname}/public`));
app.use('/api', router);
app.use(useErrorHandler(answer));

function deinit() {
    db.destrucor();
    setTimeout(() =>process.exit(), 500);
}

app.listen(PORT, () => console.log(`${NAME} started at port ${PORT}, MAX signature check ${AUTH.BOT_TOKEN ? 'enabled' : 'disabled'}`));

process.on('SIGNINT', deinit);