class BaseManager {
    constructor (mediator, db) {
        this.mediator = mediator;
        this.db = db;

        this.EVENTS = mediator.getEventTypes();
        this.TRIGGERS = mediator.getTriggerTypes();
    }


}

module.exports = BaseManager;