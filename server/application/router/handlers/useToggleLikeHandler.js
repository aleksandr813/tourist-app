const { isString, isId } = require('../validators');
const getUserId = require('../getUserId');

module.exports = (mediator, answer) => {
    const { TOGGLE_LIKE } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route_guid, user_id } = req.body ?? {};

        if (!isString(route_guid) || !(user_id == null || isId(user_id))) {
            return answer.bad(res, 67);
        }

        const userId = await getUserId(mediator, req, user_id);
        if (!userId) {
            return answer.bad(res, 11);
        }

        const result = await mediator.get(TOGGLE_LIKE, {
            routeGuid: route_guid,
            userId,
        });
        return result ? res.send(answer.good(result)) : answer.bad(res, 25);
    };
};
