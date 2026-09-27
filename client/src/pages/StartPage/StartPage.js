import { useEffect, useState } from "react";
import { ServerContext, StoreContext } from "../../App";
import { useContext } from "react";
import Geo from "../../services/Geo/Geo";
import Max from "../../services/Max/Max";
import CitySearch from "./CitySearch/CitySearch";

import './StartPage.css'

const geo = new Geo();
const max = new Max();

export default function StartPage({setPage, PAGES}){

    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [citiesList, setCitiesList] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [nearestCity, setNearestCity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    function sendCity() {
        store.set("selectedCity", selectedCity);
        store.set("routesPage", 1);
        setPage(PAGES.ROUTES);
    }

    async function openSharedRoute(citiesList) {
        const routeGuid = max.getSharedRouteGuid();
        if (!routeGuid || store.get("sharedRouteOpened")) {
            return false;
        }
        store.set("sharedRouteOpened", true);

        const route = await server.getRoute(routeGuid, store.get("userId"));
        const city = route && citiesList.find((item) => item.guid === route.city_guid);
        if (!city) {
            return false;
        }

        store.set("selectedCity", city);
        store.set("selectedRoute", route);
        store.set("routesPage", 1);
        setPage(PAGES.ROUTE);
        return true;
    }

    useEffect(() => {
        let cancelled = false;

        async function getCities(){
            setIsLoading(true);
            setLoadError(null);
            const citiesList = await server.getCitiesList();
            if (cancelled) {
                return;
            }
            setIsLoading(false);
            if (!citiesList) {
                setLoadError("Не удалось загрузить список городов");
                return;
            }
            setCitiesList(citiesList);

            if (await openSharedRoute(citiesList)) {
                return;
            }

            const position = await geo.getPosition();
            if (!position || cancelled) {
                return;
            }
            const city = geo.findNearest(citiesList, position);
            setNearestCity(city);
            setSelectedCity((currentCity) => currentCity ?? city);
        }
        getCities();

        return () => {
            cancelled = true;
        };
    },[attempt])

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
                    disabled={isLoading || Boolean(loadError)}
                    placeholder={isLoading ? "Загружаем города..." : "Начните вводить город..."}
                />

                {loadError && (
                    <div className="choose-town__error" role="alert">
                        <p>{loadError}</p>
                        <button type="button" className="choose-town__retry" onClick={() => setAttempt(attempt + 1)}>
                            Повторить
                        </button>
                    </div>
                )}

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
