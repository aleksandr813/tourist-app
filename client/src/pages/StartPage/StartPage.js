import PageManager from "../PageManager"
import { useEffect, useState } from "react";
import './StartPage.css'
import Server from "../../services/Server/Server";
import Store from "../../services/Store";
import { ServerContext } from "../../App";
import { useContext } from "react";

export default function StartPage({setPage, PAGES}){    

    const server = useContext(ServerContext);
    const [selected, setSelected] = useState("");
    const [citiesList, setCitiesList] = useState([]);

    async function getCities(){
        const citiesList = await server.getCitiesList();
    
        setCitiesList(citiesList);
    }

    async function sendCity() {
        const selectCity = await server.sendCity();
    }

    useEffect(() => {
        async function getCities(){
            const citiesList = await server.getCitiesList();
            console.log(citiesList);
            setCitiesList(citiesList);
        }
        getCities();
    },[])

    return <div id= "chooseTownID">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Выберите...</option>
        {Object.entries(citiesList).map(([key, label]) => (
            <option key={key} value={key}>
            {label}
        </option>
        ))}
        </select>
        <button onClick={sendCity}>Далее</button>
    </div>
}


