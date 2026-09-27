import { useEffect, useState } from "react";
import { ServerContext, StoreContext } from "../../App";
import { useContext } from "react";
import Geo from "../../services/Geo/Geo";
import CitySearch from "./CitySearch/CitySearch";

import './StartPage.css'

const geo = new Geo();

export default function StartPage({setPage, PAGES}){

    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [citiesList, setCitiesList] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [nearestCity, setNearestCity] = useState(null);

    function sendCity() {
        store.set("selectedCity", selectedCity);
        store.set("routesPage", 1);
        setPage(PAGES.ROUTES);
    }

    useEffect(() => {
        async function getCities(){
            const citiesList = await server.getCitiesList();
            if (!citiesList) {
                return;
            }
            setCitiesList(citiesList);

            const position = await geo.getPosition();
            if (!position) {
                return;
            }
            const city = geo.findNearest(citiesList, position);
            setNearestCity(city);
            setSelectedCity((currentCity) => currentCity ?? city);
        }
        getCities();
    },[])

    return (
        <main id="chooseTownID">
            <div className="choose-town__card">
                <h1 className="choose-town__title">Выберите город</h1>
                <p className="choose-town__subtitle">
                    Найдите готовые туристические маршруты и узнайте стоимость дня заранее
                </p>

                <CitySearch
                    cities={citiesList}
                    value={selectedCity}
                    onChange={setSelectedCity}
                />

                {selectedCity && selectedCity.guid === nearestCity?.guid && (
                    <p className="choose-town__hint">Ближайший к вам город</p>
                )}

                <button className="choose-town__button" onClick={sendCity} disabled={!selectedCity}>
                    Далее
                </button>
            </div>
        </main>
    );
}
