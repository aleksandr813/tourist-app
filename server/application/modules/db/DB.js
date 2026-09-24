const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');
const ORM = require('./ORM');

class DB {
    constructor({ DATABASE }) {
        this.db = new sqlite3.Database(path.resolve(__dirname, DATABASE.NAME));
        this.orm = new ORM(this.db);
        this.ready = this.createTables();
        this.routeWrites = Promise.resolve();
    }

    async createTables() {
        await this.orm._run('PRAGMA foreign_keys = ON');
        await this.orm._run(`
            CREATE TABLE IF NOT EXISTS cities (
                guid TEXT NOT NULL,
                city TEXT NOT NULL,
                x INTEGER NOT NULL,
                y INTEGER NOT NULL
            )
        `);
        await this.orm._run(`
            CREATE TABLE IF NOT EXISTS routes (
                guid TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL DEFAULT '',
                cost INTEGER,
                title TEXT NOT NULL,
                x REAL,
                y REAL,
                PRIMARY KEY(guid)
            )
        `);
        await this.orm._run(`
            CREATE TABLE IF NOT EXISTS places (
                guid TEXT NOT NULL UNIQUE,
                route_id TEXT REFERENCES routes(guid),
                name TEXT NOT NULL,
                x REAL NOT NULL,
                y REAL NOT NULL,
                price REAL NOT NULL,
                description TEXT NOT NULL
            )
        `);

        // Дополняем существующую БД, сохраняя ранее добавленные записи.
        const routeColumns = await this.orm.raw('PRAGMA table_info(routes)');
        if (!routeColumns.some((column) => column.name === 'name')) {
            await this.orm._run("ALTER TABLE routes ADD COLUMN name TEXT NOT NULL DEFAULT ''");
        }
        const placeColumns = await this.orm.raw('PRAGMA table_info(places)');
        if (!placeColumns.some((column) => column.name === 'route_id')) {
            await this.orm._run('ALTER TABLE places ADD COLUMN route_id TEXT REFERENCES routes(guid)');
        }
    }

    async getCities() {
        await this.ready;
        return await this.orm.all('cities');
    }

    async getRoutes(coords, radius) {
        await this.ready;
        const { x, y } = coords;
        return await this.orm.raw(
            `SELECT * FROM routes WHERE ((x - ?) * (x - ?) + (y - ?) * (y - ?)) <= (? * ?)`,
            [x, x, y, y, radius, radius]
        );
    }

    async addRoute(route, places = []) {
        // Запросы используют одно соединение: транзакции выполняются по очереди.
        const write = this.routeWrites.then(async () => {
            await this.ready;
            await this.orm._run('BEGIN TRANSACTION');
            try {
                const result = await this.orm.insert('routes', route);
                await this.addPlaces('places', places);
                await this.orm._run('COMMIT');
                return result;
            } catch (error) {
                await this.orm._run('ROLLBACK');
                throw error;
            }
        });
        this.routeWrites = write.catch(() => {});
        return await write;
    }

    async addPlaces(table, array) {
        await this.ready;
        return await this.orm.insertAll(table, array);
    }

    destructor() {
        this.db.close();
    }
}

module.exports = DB;