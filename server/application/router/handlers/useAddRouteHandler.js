const { isString, isOptionalString, isNumber, isId } = require('../validators');
const getUserId = require('../getUserId');

const isValidRoute = (route) =>
    route &&
    isString(route.name) &&
    isString(route.title) &&
    (route.author_id == null || isId(route.author_id)) &&
    isString(route.city_guid) &&
    isNumber(route.cost) &&
    isNumber(route.x) &&
    isNumber(route.y) &&
    isOptionalString(route.photo_url);

const isValidPlace = (place) =>
    place &&
    isString(place.name) &&
    isNumber(place.x) &&
    isNumber(place.y) &&
    isNumber(place.price) &&
    isOptionalString(place.description) &&
    isOptionalString(place.photo_url);

module.exports = (mediator, answer) => {
    const { ADD_ROUTE } = mediator.getTriggerTypes();
    return async (req, res) => {
        const { route, places } = req.body ?? {};

        if (!isValidRoute(route) || !Array.isArray(places) || !places.length || !places.every(isValidPlace)) {
            return answer.bad(res, 67);
        }

        const routeGuid = await mediator.get(ADD_ROUTE, {
            route: {
                name: route.name,
                cost: route.cost,
                title: route.title,
                x: route.x,
                y: route.y,
                author_id: await getUserId(mediator, req, route.author_id),
                city_guid: route.city_guid,
                photo_url: route.photo_url ?? null,
            },
            places: places.map(({ name, x, y, price, description, photo_url }) => ({
                name,
                x,
                y,
                price,
                description: description ?? '',
                photo_url: photo_url ?? null,
            })),
        });
        return routeGuid ? res.send(answer.good(routeGuid)) : answer.bad(res, 11);
    };
};
