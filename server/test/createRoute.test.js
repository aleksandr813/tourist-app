const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const express = require('express');
const sqlite3 = require('sqlite3');
const CONFIG = require('../config');
const DB = require('../application/modules/db/DB');
const ORM = require('../application/modules/db/ORM');
const Common = require('../application/modules/Common/Common');
const Mediator = require('../application/modules/Mediator/Mediator');
const RoutesManager = require('../application/modules/routes/RoutesManager');
const Answer = require('../application/Answer');
const Router = require('../application/router/Router');

const close = (db) => new Promise((resolve, reject) => {
    db.close((error) => error ? reject(error) : resolve());
});

const payload = () => ({
    route: { name: 'Прогулка', cost: 0, title: 'Маршрут по центру', x: 0, y: 37.62 },
    places: [
        { name: 'Парк', x: 0, y: 37.62, price: 0, description: '' },
        { name: 'Музей', x: 55.75, y: 37.63, price: 200.5, description: 'Выставка' },
    ],
});

test('POST /api/createRoute', async (t) => {
    t.mock.method(console, 'log', () => {});
    const directory = await mkdtemp(path.join(tmpdir(), 'tourist-create-route-'));
    const filename = path.join(directory, 'test.db');

    // Схема до добавления ручки: проверяем обновление БД с существующими данными.
    const legacy = new sqlite3.Database(filename);
    const legacyORM = new ORM(legacy);
    await legacyORM._run('CREATE TABLE routes (guid TEXT PRIMARY KEY, cost INTEGER, title TEXT NOT NULL, x REAL, y REAL)');
    await legacyORM._run('CREATE TABLE places (guid TEXT UNIQUE NOT NULL, name TEXT NOT NULL, x REAL NOT NULL, y REAL NOT NULL, price REAL NOT NULL, description TEXT NOT NULL)');
    await legacyORM.insert('routes', { guid: 'old-route', cost: 100, title: 'Старый маршрут', x: 1, y: 2 });
    await legacyORM.insert('places', { guid: 'old-place', name: 'Старое место', x: 1, y: 2, price: 0, description: '' });
    await close(legacy);

    const db = new DB({ DATABASE: { NAME: filename } });
    const common = new Common();
    const mediator = new Mediator(CONFIG.MEDIATOR);
    const answer = new Answer();
    new RoutesManager({ mediator, db, common });
    const app = express();
    app.use(express.json());
    app.use('/api', Router({ mediator, answer }));
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    t.after(async () => {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
        await close(db.db);
        await rm(directory, { recursive: true, force: true });
    });
    const url = `http://127.0.0.1:${server.address().port}/api/createRoute`;
    const post = (body) => fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    await t.test('сохраняет маршрут, места, связь и старые данные', async () => {
        const body = payload();
        body.route.name = "Маршрут 'Центр'";
        body.route.guid = 'client-route';
        body.places[0].route_id = 'other-route';
        body.places[0].guid = 'client-place';
        const response = await post(body);
        assert.equal(response.status, 201);
        const { result, data } = await response.json();
        assert.equal(result, 'ok');
        assert.equal(data.route.name, body.route.name);
        assert.equal(data.route.cost, 0);
        assert.equal(data.route.x, 0);
        assert.notEqual(data.route.guid, 'client-route');
        assert.notEqual(data.places[0].guid, 'client-place');
        assert.deepEqual(await db.orm.get('routes', { guid: data.route.guid }), data.route);
        assert.deepEqual(await db.orm.all('places', { route_id: data.route.guid }), data.places);
        assert.equal(data.places[0].route_id, data.route.guid);
        assert.equal(data.places[1].route_id, data.route.guid);
        assert.equal((await db.orm.get('routes', { guid: 'old-route' })).title, 'Старый маршрут');
        assert.equal((await db.orm.get('places', { guid: 'old-place' })).name, 'Старое место');
        await db.createTables(); // Повторный запуск миграции безопасен.
        assert.ok((await db.getRoutes({ x: 0, y: 37.62 }, 1)).some((route) => route.guid === data.route.guid));
    });

    await t.test('отклоняет некорректные данные без записи в БД', async () => {
        const count = await db.orm.count('routes');
        const invalid = [
            {}, { route: null, places: [] },
            { ...payload(), places: {} },
            { ...payload(), places: [null] },
            { ...payload(), places: [{}] },
            { ...payload(), route: { ...payload().route, name: ' ' } },
            { ...payload(), route: { ...payload().route, cost: -1 } },
            { ...payload(), route: { ...payload().route, x: '55.7' } },
        ];
        for (const body of invalid) {
            const response = await post(body);
            assert.equal(response.status, 400);
            assert.equal(await response.text(), answer.bad(67));
        }
        const noBody = await fetch(url, { method: 'POST' });
        assert.equal(noBody.status, 400);
        assert.equal(await db.orm.count('routes'), count);
    });

    await t.test('допускает пустой список мест', async () => {
        const response = await post({ ...payload(), places: [] });
        assert.equal(response.status, 201);
        const { data } = await response.json();
        assert.deepEqual(data.places, []);
        assert.ok(await db.orm.get('routes', { guid: data.route.guid }));
    });

    await t.test('откатывает маршрут при ошибке добавления мест', async (t) => {
        const routeCount = await db.orm.count('routes');
        const placeCount = await db.orm.count('places');
        let index = 0;
        t.mock.method(common, 'guid', () => index++ === 0 ? 'rollback-route' : 'duplicate-place');
        t.mock.method(console, 'error', () => {});
        const response = await post(payload());
        assert.equal(response.status, 500);
        assert.equal(await response.text(), answer.bad(24));
        assert.equal(await db.orm.count('routes'), routeCount);
        assert.equal(await db.orm.count('places'), placeCount);
    });

    await t.test('сохраняет параллельные запросы после ошибки транзакции', async () => {
        const count = await db.orm.count('routes');
        const responses = await Promise.all(Array.from({ length: 4 }, () => post(payload())));
        const guids = new Set();
        for (const response of responses) {
            assert.equal(response.status, 201);
            const { data } = await response.json();
            guids.add(data.route.guid);
            assert.equal(await db.orm.count('places', { route_id: data.route.guid }), 2);
        }
        assert.equal(guids.size, 4);
        assert.equal(await db.orm.count('routes'), count + 4);
    });

    await t.test('создаёт таблицы в новой БД', async () => {
        const fresh = new DB({ DATABASE: { NAME: path.join(directory, 'fresh.db') } });
        try {
            await fresh.ready;
            const route = { guid: 'fresh-route', ...payload().route };
            await fresh.addRoute(route);
            assert.deepEqual(await fresh.orm.get('routes', { guid: route.guid }), route);
        } finally {
            await close(fresh.db);
        }
    });
});
