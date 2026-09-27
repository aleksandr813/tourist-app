const { isString, isOptionalString } = require('../validators');
const getUserId = require('../getUserId');

module.exports = (mediator, answer) => {
    const { GET_ROUTE } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route, user } = req.query;

        if (!isString(route) || !isOptionalString(user)) {
            return answer.bad(res, 67);
        }

        const result = await mediator.get(GET_ROUTE, {
            routeGuid: route,
            userId: await getUserId(mediator, req, user),
        });
        return result ? res.send(answer.good(result)) : answer.bad(res, 25);
    };
};
