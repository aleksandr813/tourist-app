import PageManager from "../PageManager"
import { useEffect, useState } from "react";
import { ServerContext } from "../../App";
import { useContext } from "react";

import './StartPage.css'

export default function StartPage({setPage, PAGES}){    

    const server = useContext(ServerContext);
    const [selected, setSelected] = useState("");
    const [citiesList, setCitiesList] = useState([]);

    async function sendCity() {
        await server.sendCity(selected);
    }

    useEffect(() => {
        async function getCities(){
            const citiesList = await server.getCitiesList();
            console.log(citiesList);
            if (citiesList) {
                setCitiesList(citiesList);
            }
        }
        getCities();
    },[])

    return <div id= "chooseTownID">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Выберите...</option>
        {citiesList.map((item) => (
            <option key={item.guid} value={item.guid}>
            {item.city}
        </option>
        ))}
        </select>
        <button onClick={sendCity}>Далее</button>
    </div>
}

