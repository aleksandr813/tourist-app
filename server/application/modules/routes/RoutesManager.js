const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);

        this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
        this.mediator.set(this.TRIGGERS.GET_ROUTES, (data) => this.triggerGetRoutes(data.coords, data.radius));
        this.mediator.set(this.TRIGGERS.CREATE_ROUTE, (data) => this.triggerCreateRoute(data.route, data.places));
    }

    triggerGetCities() {
       return this.db.getCities();
    }

    triggerGetRoutes(coords, radius) { // Возвращает маршруты в пределах радиуса
        return this.db.getRoutes(coords, radius);
    }

    async triggerCreateRoute(route, places) {
        const { name, cost, title, x, y } = route;
        const newRoute = {
            guid: this.common.guid(),
            name: name.trim(),
            cost,
            title: title.trim(),
            x,
            y,
        };
        const newPlaces = places.map(({ name, x, y, price, description }) => ({
            guid: this.common.guid(),
            route_id: newRoute.guid,
            name: name.trim(),
            x,
            y,
            price,
            description,
        }));

        await this.db.addRoute(newRoute, newPlaces);
        return { route: newRoute, places: newPlaces };
    }

}

module.exports = RoutesManager;