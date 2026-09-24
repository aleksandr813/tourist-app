module.exports = (mediator, answer) => {
    const { CREATE_ROUTE } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route, places } = req.body || {};
        const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
        const isText = (value) => typeof value === 'string' && value.trim().length > 0;
        const isPrice = (value) => Number.isFinite(value) && value >= 0;

        if (!isObject(route) || !isText(route.name) || !isText(route.title) ||
            !isPrice(route.cost) || !Number.isFinite(route.x) || !Number.isFinite(route.y) ||
            !Array.isArray(places) || places.some((place) =>
                !isObject(place) || !isText(place.name) ||
                !Number.isFinite(place.x) || !Number.isFinite(place.y) ||
                !isPrice(place.price) || typeof place.description !== 'string'
            )) {
            return res.status(400).send(answer.bad(67));
        }

        try {
            const result = await mediator.get(CREATE_ROUTE, { route, places });
            return res.status(201).send(answer.good(result));
        } catch (error) {
            console.error('Ошибка создания маршрута:', error);
            return res.status(500).send(answer.bad(24));
        }
    };
};
