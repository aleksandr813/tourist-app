export default class Store{

    selectedCity  = {};

    constructor(){}

    setSelectedCity(selectedCity){
        this.selectCity = selectedCity;
    }

    getSelectedCity(){
        console.log(this.selectedCity)
        return this.selectedCity;
    }

}