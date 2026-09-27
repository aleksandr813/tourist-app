const { isString, isOptionalString } = require('../validators');
const getUserId = require('../getUserId');

module.exports = (mediator, answer) => {
    const { GET_ROUTES } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { city, user, sort, page = 1 } = req.query;
        const pageNumber = Number(page);

        if (
            !isString(city) ||
            !isOptionalString(user) ||
            !isOptionalString(sort) ||
            !Number.isInteger(pageNumber) ||
            pageNumber < 1
        ) {
            return answer.bad(res, 67);
        }

        const routes = await mediator.get(GET_ROUTES, {
            cityGuid: city,
            userId: await getUserId(mediator, req, user),
            sort,
            page: pageNumber,
        });

        return res.send(answer.good(routes));
    };
};
