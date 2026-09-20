import PageManager from "../PageManager"
import { useState } from "react";
import CONFIG from "../../Config";
import './StartPage.css'

const {townList} = CONFIG;


export default function StartPage({setPage, PAGES}){    

    const [selected, setSelected] = useState("");
    return <div id= "chooseTownID">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Выберите...</option>
        {Object.entries(townList).map(([key, label]) => (
            <option key={key} value={key}>
            {label}
            </option>
        ))}
        </select>
    </div>
}


