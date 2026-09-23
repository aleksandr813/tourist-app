class BaseManager {
    constructor (params) {
        const { mediator, db, common } = params;

        this.mediator = mediator;
        this.db = db;
        this.common = common;

        this.EVENTS = mediator.getEventTypes();
        this.TRIGGERS = mediator.getTriggerTypes();
    }


}

module.exports = BaseManager;