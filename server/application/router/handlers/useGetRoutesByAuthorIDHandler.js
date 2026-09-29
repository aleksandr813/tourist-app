const { isString } = require('../validators');

module.exports = (mediator, answer) => {
    const { GET_ROUTES_BY_AUTHOR } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { author } = req.query;

        if (!isString(author)) {
            return answer.bad(res, 67);
        }

        const routes = await mediator.get(GET_ROUTES_BY_AUTHOR, { authorId: author });
        return res.send(answer.good(routes));
    };
};