import PageManager from "../PageManager"
import { useEffect, useState } from "react";
import { ServerContext, StoreContext } from "../../App";
import { useContext } from "react";

import './StartPage.css'

export default function StartPage({setPage, PAGES, setSelectedCity}){

    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [selected, setSelected] = useState("");
    const [citiesList, setCitiesList] = useState([]);

    async function sendCity() {
        const city = citiesList.find((item) => item.guid === selected);
        if (!city) {
            return;
        }

        await server.sendCity(city.guid);
        setSelectedCity(city);
        setPage(PAGES.ROUTES);
        store.setSelectedCity(selected);
        store.getSelectedCity();
    }

    useEffect(() => {
        async function getCities(){
            const citiesList = await server.getCitiesList();
            if (citiesList) {
                setCitiesList(citiesList);
            }
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

                <select
                    className="choose-town__select"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                >
                    <option value="">Выберите город...</option>
                    {citiesList.map((item) => (
                        <option key={item.guid} value={item.guid}>
                            {item.city}
                        </option>
                    ))}
                </select>

                <button className="choose-town__button" onClick={sendCity} disabled={!selected}>
                    Далее
                </button>
            </div>
        </main>
    );
}
