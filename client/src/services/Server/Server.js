import CONFIG from "../../Config";
import Store from "../Store/Store";

const {HOST, INIT_DATA_HEADER} = CONFIG;

export default class Server {   

    constructor(store){
        this.store = store;
    }

    async request(method, params = {}, options = {}) {
        const query = Object.keys(params)
            .filter(key => params[key] != null)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const url = `${HOST}/${method}${query ? `?${query}` : ''}`;

        const initData = this.store.get('initData');
        const headers = initData ? { ...options.headers, [INIT_DATA_HEADER]: initData } : options.headers;

        const response = await fetch(url, { ...options, headers });
        const isJson = response.headers.get('Content-Type')?.includes('application/json');

        if (!isJson) {
            console.error('Server error:', response.status);
            return null;
        }

        const answer = await response.json();

        if (answer.result === 'ok' && answer.data) {
            return answer.data;
        }

        console.error('Server error:', answer.error?.message ?? response.status);
        return null;
    }

    async getCitiesList(){
        const response = await this.request('getCities');   
        if (!response) {
            return null;
        }

        console.log('Cities from server:', response);
        return response;
    }

    async sendCity(city) {
        return await this.request(`chooseCity/${city}`);
    }

    async getRoutesList({ city, user, sort, page }) {
        const response = await this.request('getRoutes', { city, user, sort, page });
        if (!response) {
            return null;
        }

        return response;
    }

    async getUserRoutesList(userId){
        return await this.request('getUserRoutesList', {user_id: userId})
    }

    async toggleLike(routeGuid, userId) {
        return await this.request('toggleLike', {}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ route_guid: routeGuid, user_id: userId }),
        });
    }

    async getRoute(routeGuid, userId) {
        return await this.request('getRoute', { route: routeGuid, user: userId });
    }

    async getPlaces(routeGuid) {
        return await this.request('getPlaces', { route: routeGuid });
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        return await this.request('uploadImage', {}, {
            method: 'POST',
            body: formData,
        });
    }

    async addRoute(route, places) {
        return await this.request('addRoute', {}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ route, places }),
        });
    }

}