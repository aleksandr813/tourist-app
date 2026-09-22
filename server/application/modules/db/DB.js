const sqlite3 = require('sqlite3').verbose();
const ORM = require('./ORM');

class DB {
    constructor({ DATABASE }) {
        this.db = new sqlite3.Database(`${__dirname}/${DATABASE.NAME}`);
        this.orm = new ORM(this.db);
        this.createTables();
    }

    createTables() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS cities (
                    guid TEXT NOT NULL,
                    city TEXT NOT NULL,
                    x INTEGER NOT NULL,
                    y INTEGER NOT NULL
                )
            `);

            this.db.run(`
                CREATE TABLE IF NOT EXISTS routes (
                    guid TEXT NOT NULL UNIQUE,
                    cost INTEGER,
                    title TEXT NOT NULL,
                    x REAL,
                    y REAL,
                    PRIMARY KEY(guid)
                )
            `);

            this.seedTestRoutes();
        });
    }

    // Тестовые маршруты для демонстрации - рядом с координатами тестового города (Ижевск, x=312, y=312.3123)
    seedTestRoutes() {
        this.db.get('SELECT COUNT(*) as count FROM routes', (err, row) => {
            if (err || (row && row.count > 0)) {
                return;
            }

            const testRoutes = [
                { guid: 'route-test-1', title: 'Прогулка по набережной Ижевска', cost: 500, x: 312.6, y: 312.9 },
                { guid: 'route-test-2', title: 'Исторический центр и Ижевский пруд', cost: 900, x: 311.7, y: 311.9 },
                { guid: 'route-test-3', title: 'Парк культуры и отдыха', cost: 0, x: 312.3, y: 313.1 },
                { guid: 'route-test-4', title: 'Гастротур по Ижевску', cost: 1800, x: 312.0, y: 312.5 },
            ];

            testRoutes.forEach((route) => {
                this.db.run(
                    'INSERT INTO routes (guid, cost, title, x, y) VALUES (?, ?, ?, ?, ?)',
                    [route.guid, route.cost, route.title, route.x, route.y]
                );
            });
        });
    }

    async getCities() {
        return await this.orm.all('cities');
    }

    async getRoutes(coords, radius) { // Возвращает маршруты в пределах радиуса от точки coords
        const { x, y } = coords;
        return await this.orm.raw(
            `SELECT * FROM routes WHERE ((x - ?) * (x - ?) + (y - ?) * (y - ?)) <= (? * ?)`,
            [x, x, y, y, radius, radius]
        );
    }

    destructor() {
        this.db.close();
    }
}

module.exports = DB;