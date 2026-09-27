const { isString, isOptionalString } = require('../validators');

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
            return res.send(answer.bad(67));
        }

        const routes = await mediator.get(GET_ROUTES, {
            cityGuid: city,
            userId: user ?? null,
            sort,
            page: pageNumber,
        });

        return res.send(answer.good(routes));
    };
};
