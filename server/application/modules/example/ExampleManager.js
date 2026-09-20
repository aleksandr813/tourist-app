const BaseManager = require('../BaseManager');

class ExampleManager extends BaseManager{
    constructor(params) {
        super(params);

        this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
    }
    async triggerGetCities()
    {
        const cities = await this.db.getCities()
        
    }
}

module.exports = ExampleManager;