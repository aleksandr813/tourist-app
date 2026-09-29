const BaseManager = require('../BaseManager');

class RoutesManager extends BaseManager{
    constructor(params) {
        super(params);
        this.pageSize = params.pageSize;
        this.anonymousAuthorId = params.anonymousAuthorId;

        this.mediator.set(this.TRIGGERS.GET_CITIES, (data) => this.triggerGetCities());
        this.mediator.set(this.TRIGGERS.GET_ROUTES, (data) => this.triggerGetRoutes(data));
        this.mediator.set(this.TRIGGERS.GET_ROUTES_BY_AUTHOR, (data) => this.triggerGetRoutesByAuthor(data.authorId));
        this.mediator.set(this.TRIGGERS.GET_ROUTE, (data) => this.triggerGetRoute(data.routeGuid, data.userId));
        this.mediator.set(this.TRIGGERS.GET_PLACES, (data) => this.triggerGetPlaces(data.routeGuid));
        this.mediator.set(this.TRIGGERS.ADD_ROUTE, (data) => this.triggerAddRoute(data.route, data.places));
        this.mediator.set(this.TRIGGERS.TOGGLE_LIKE, (data) => this.triggerToggleLike(data.routeGuid, data.userId));
    }

    triggerGetCities() {
       return this.db.getCities();
    }

    async triggerGetRoutes({ cityGuid, userId, sort, page }) {
        const [routes, total] = await Promise.all([
            this.db.getRoutes({
                cityGuid,
                userId,
                sort,
                limit: this.pageSize,
                offset: (page - 1) * this.pageSize,
            }),
            this.db.countRoutes(cityGuid),
        ]);
        return { routes, pagesCount: Math.ceil(total / this.pageSize) };
    }
    triggerGetRoute(routeGuid, userId) {
        return this.db.getRouteWithLikes(routeGuid, userId);
    }
    
    triggerGetPlaces(routeGuid) {
        return this.db.getPlaces(routeGuid);
    }
    
    
    triggerGetRoutesByAuthor(authorId) {
        return this.db.getRoutesByAuthorID(authorId);
    }
        
    async triggerAddRoute(route, places) {
        const authorId = route.author_id ?? this.anonymousAuthorId;
        if (!authorId) {
            return null;
        }

        const routeGuid = this.common.guid();
        await this.db.addRoute({ guid: routeGuid, ...route, author_id: authorId, created_at: Date.now() });
        await this.db.addPlaces('places', places.map((place) => ({
            guid: this.common.guid(),
            ...place,
            route_guid: routeGuid,
        })));
        return routeGuid;
    }

    async triggerToggleLike(routeGuid, userId) {
        if (!await this.db.getRoute(routeGuid)) {
            return null;
        }

        const like = { route_guid: routeGuid, user_id: userId };
        const liked = !await this.db.getLike(like);
        if (liked) {
            await this.db.addLike(like);
        } else {
            await this.db.deleteLike(like);
        }

        return { liked, likes: await this.db.countLikes(routeGuid) };
    }

}

module.exports = RoutesManager;