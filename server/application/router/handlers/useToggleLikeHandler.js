const { isString, isId } = require('../validators');

module.exports = (mediator, answer) => {
    const { TOGGLE_LIKE } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route_guid, user_id } = req.body ?? {};

        if (!isString(route_guid) || !isId(user_id)) {
            return res.send(answer.bad(67));
        }

        const result = await mediator.get(TOGGLE_LIKE, {
            routeGuid: route_guid,
            userId: String(user_id),
        });
        return res.send(result ? answer.good(result) : answer.bad(25));
    };
};
