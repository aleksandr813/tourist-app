const BaseManager = require('../BaseManager');

class ExampleManager extends BaseManager{
    constructor({ params }) {
        super();

        this.mediator.set(this.TRIGGERS.EXAMPLE_TRIGGER, () => console.log("EXAMPLE_TRIGGER is shoted"));
    }

}