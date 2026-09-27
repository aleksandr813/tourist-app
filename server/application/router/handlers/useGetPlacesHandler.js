const { isString } = require('../validators');

module.exports = (mediator, answer) => {
    const { GET_PLACES } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route } = req.query;

        if (!isString(route)) {
            return res.send(answer.bad(67));
        }

        const places = await mediator.get(GET_PLACES, { routeGuid: route });
        return res.send(answer.good(places));
    };
};
