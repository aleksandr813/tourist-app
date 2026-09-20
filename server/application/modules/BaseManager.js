class BaseManager {
    constructor (params) {
        const { mediator, db } = params;

        this.mediator = mediator;
        this.db = db;

        this.EVENTS = mediator.getEventTypes();
        this.TRIGGERS = mediator.getTriggerTypes();
    }


}

module.exports = BaseManager;