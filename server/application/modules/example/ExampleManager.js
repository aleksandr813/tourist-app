const BaseManager = require('../BaseManager');

class ExampleManager extends BaseManager{
    constructor(params) {
        super(params);

        this.mediator.set(this.TRIGGERS.EXAMPLE_TRIGGER, () => console.log("EXAMPLE_TRIGGER is shoted"));
    }

}

module.exports = ExampleManager;