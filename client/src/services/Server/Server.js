import CONFIG from "../../Config";
import Store from "../Store";

const {HOST} = CONFIG;

export default class Server {   

    constructor(store){
        this.store = store;
    }

    async request(method, params = {}) {
        try {
            const query = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
            const url = `${HOST}/${method}${query ? '?' + query : ''}`;
            console.log(url);
            const response = await fetch(url);
            const answer = await response.json();

            if (answer.result === 'ok' && answer.data) {
                return answer.data;
            }
            return null;
        } catch (e) {
            console.log('Request exception:', e);
            return null;
        }
    }

    async getCitiesList(){
        console.log("OBAMA");
        const response = await this.request('getCities');   
        if (!response) {
            return null;
        }

        console.log('Cities from server:', response);
        return response;
    }

    async sendCity(city) {
        this.request('sendCity', {city});
    }

}