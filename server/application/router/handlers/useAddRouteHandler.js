const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const isValidRoute = (route) =>
    route &&
    route.name &&
    route.title &&
    route.author_id &&
    isNumber(route.cost) &&
    isNumber(route.x) &&
    isNumber(route.y);

const isValidPlace = (place) =>
    place &&
    place.name &&
    isNumber(place.x) &&
    isNumber(place.y) &&
    isNumber(place.price);

module.exports = (mediator, answer) => {
    const { ADD_ROUTE } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route, places } = req.body ?? {};

        if (!isValidRoute(route) || !Array.isArray(places) || !places.length || !places.every(isValidPlace)) {
            return res.send(answer.bad(67));
        }

        try {
            const routeGuid = await mediator.get(ADD_ROUTE, {
                route: {
                    name: route.name,
                    cost: route.cost,
                    title: route.title,
                    x: route.x,
                    y: route.y,
                    author_id: String(route.author_id),
                },
                places: places.map(({ name, x, y, price, description }) => ({
                    name,
                    x,
                    y,
                    price,
                    description: description ?? '',
                })),
            });
            return res.send(answer.good(routeGuid));
        } catch (error) {
            return res.send(answer.bad(24));
        }
    };
};
