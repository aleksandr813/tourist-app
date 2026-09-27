const sqlite3 = require('sqlite3').verbose();
const ORM = require('./ORM');
const cities = require('./seeds/cities.json');

const ROUTES_ORDER = {
    date: 'routes.created_at DESC',
    likes: 'likes DESC, routes.created_at DESC',
};

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
                    region TEXT,
                    x REAL NOT NULL,
                    y REAL NOT NULL
                )
            `);

            this.db.run(`
                CREATE TABLE IF NOT EXISTS routes (
                    guid TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    cost INTEGER,
                    title TEXT NOT NULL,
                    x REAL,
                    y REAL,
                    author_id TEXT NOT NULL,
                    photo_url TEXT,
                    city_guid TEXT,
                    created_at INTEGER,
                    PRIMARY KEY(guid)
                )
            `);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS places (
                guid	TEXT NOT NULL UNIQUE,
                name	TEXT NOT NULL,
                x	REAL NOT NULL,
                y	REAL NOT NULL,
                price	REAL NOT NULL,
                description	TEXT NOT NULL,
                route_guid  TEXT,
                photo_url   TEXT,
                FOREIGN KEY("route_guid") REFERENCES "routes"("guid")
                )
            `);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS likes (
                    route_guid TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    PRIMARY KEY(route_guid, user_id),
                    FOREIGN KEY("route_guid") REFERENCES "routes"("guid")
                )
            `);
            this.seedCities();
        });
    }

    async seedCities() {
        if (await this.orm.count('cities')) {
            return;
        }
        await this.orm.insertAll('cities', cities);
    }

    async getCities() {
        return await this.orm.all('cities');
    }

    async getRoutes({ cityGuid, userId, sort, limit, offset }) {
        return await this.orm.raw(
            `SELECT routes.*,
                    COUNT(likes.user_id) AS likes,
                    COALESCE(MAX(likes.user_id = ?), 0) AS liked
             FROM routes
             LEFT JOIN likes ON likes.route_guid = routes.guid
             WHERE routes.city_guid = ?
             GROUP BY routes.guid
             ORDER BY ${ROUTES_ORDER[sort] ?? ROUTES_ORDER.date}
             LIMIT ? OFFSET ?`,
            [userId, cityGuid, limit, offset]
        );
    }

    async countRoutes(cityGuid) {
        return await this.orm.count('routes', { city_guid: cityGuid });
    }

    async getRoute(guid) {
        return await this.orm.get('routes', { guid });
    }

    async getLike(like) {
        return await this.orm.get('likes', like);
    }

    async addLike(like) {
        return await this.orm.upsert('likes', like);
    }

    async deleteLike(like) {
        return await this.orm.delete('likes', like);
    }

    async countLikes(routeGuid) {
        return await this.orm.count('likes', { route_guid: routeGuid });
    }

    async getPlaces(routeGuid) {
        return await this.orm.all('places', { route_guid: routeGuid }, { order: 'rowid' });
    }

    async addRoute(route) {
        return await this.orm.insert('routes', route);
    }

    async addPlaces(table,array){
        return await this.orm.insertAll(table,array);
    }

    destructor() {
        this.db.close();
    }
}

module.exports = DB;