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
        });
    }

    async getCities() {
        return await this.orm.all('cities');
    }

    async getRoutes(coords, radius) {
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