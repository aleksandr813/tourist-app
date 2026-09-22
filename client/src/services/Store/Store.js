export default class Store{

    data = {};

    constructor(){}

    set(name, value){
        this.data[name] = value;

    }

    get(name){
        return this.data[name];
    }

}