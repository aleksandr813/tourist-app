const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);
    
        this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
        this.mediator.set(this.TRIGGERS.GET_ROUTES, (data) => this.triggerGetRoutes(data.coords, data.radius));
        this.mediator.set(this.TRIGGERS.ADD_ROUTE, (data) => this.triggerAddRoute(data.route, data.places));
    }

    triggerGetCities() {
       return this.db.getCities();
    }

    triggerGetRoutes(coords, radius) { // Возвращает маршруты в пределах радиуса
        return this.db.getRoutes(coords, radius);
    }

    async triggerAddRoute(route, places) {
        const routeGuid = this.common.guid();
        await this.db.addRoute({ guid: routeGuid, ...route });
        await this.db.addPlaces('places', places.map((place) => ({
            guid: this.common.guid(),
            ...place,
            route_guid: routeGuid,
        })));
        return routeGuid;
    }

}

module.exports = RoutesManager;