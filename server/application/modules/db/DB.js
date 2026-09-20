const sqlite3 = require('sqlite3').verbose();
const ORM = require('./ORM');

class DB {
    constructor({ DATABASE }) {
        this.db = new sqlite3.Database(`${__dirname}/${DATABASE.NAME}`);
        this.orm = new ORM(this.db);
    }

    async getCities() {
        return await this.orm.all('cities');
    }

    destructor() {
        this.db.close();
    }
}

module.exports = DB;