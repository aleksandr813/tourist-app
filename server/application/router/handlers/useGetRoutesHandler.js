module.exports = (mediator, answer) => {
    const { GET_ROUTES } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { x, y, radius } = req.query;

        if (!x || !y || !radius) {
            return res.send(answer.bad(67));
        }

        const routes = await mediator.get(GET_ROUTES, {
            coords: { x: Number(x), y: Number(y) },
            radius: Number(radius),
        });

        return res.send(answer.good(routes));
    };
};
