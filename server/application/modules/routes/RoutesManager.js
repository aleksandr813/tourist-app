const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);

          this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
    }

    triggerGetCities() {
       return this.db.getCities();
    }

    triggerGetRoutes(coords, radius) { // Возвращает маршруты в пределах радиуса
        return this.db.getRoutes(coords, radius);
    }

}

module.exports = RoutesManager;