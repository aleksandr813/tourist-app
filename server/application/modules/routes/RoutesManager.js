const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);

          this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
    }
    async triggerGetCities()
    {
       return await this.db.getCities();
    }

}

module.exports = RoutesManager;