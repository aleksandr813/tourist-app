import CONFIG from "../../Config";
import Store from "../Store/Store";

const {HOST} = CONFIG;

export default class Server {   

    constructor(store){
        this.store = store;
    }

    async request(method, params = {}, options = {}) {
        try {
            const query = Object.keys(params)
                .map(key => `${key}=${params[key]}`)
                .join('&');

            const url = `${HOST}/${method}${query ? `?${query}` : ''}`;

            const response = await fetch(url, options);
            const answer = await response.json();

            //console.log('Server response:', answer);

            if (answer.result === 'ok' && answer.data) {
                return answer.data;
            }

            if (answer.error) {
                console.error('Server error:', answer.error);
            }

            return null;
        } catch (e) {
            console.log('Request exception:', e);
            return null;
        }
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

    async getRoutesList({ x, y, radius }) {
        const response = await this.request('getRoutes', { x, y, radius });
        if (!response) {
            return null;
        }

        return response;
    }

    async addRoute(route, places) {
        return await this.request('addRoute', {}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ route, places }),
        });
    }

}