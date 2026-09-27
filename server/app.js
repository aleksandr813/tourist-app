const express = require('express');
const app = express();
const cors = require('cors');
const CONFIG = require('./config');
const Router = require('./application/router/Router');
const Answer = require('./application/Answer');
const DB = require('./application/modules/db/DB');
const Common = require('./application/modules/Common/Common');
const Mediator = require('./application/modules/Mediator/Mediator');
const RoutesManager = require('./application/modules/routes/RoutesManager');

const { NAME, PORT, DATABASE, UPLOADS, ROUTES } = CONFIG;

const db = new DB({ DATABASE });
const mediator = new Mediator(CONFIG.MEDIATOR);
const answer = new Answer();
const common = new Common();

new RoutesManager({ mediator, db, common, pageSize: ROUTES.PAGE_SIZE });
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

function deinit() {
    db.destrucor();
    setTimeout(() =>process.exit(), 500);
}

app.listen(PORT, () => console.log(`${NAME} started at port ${PORT}`));

process.on('SIGNINT', deinit);