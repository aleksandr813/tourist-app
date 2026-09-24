import { useContext } from "react";
import { StoreContext } from "../../../App";

import "./AddPlaceButton.css"

export default function AddPlaceButton({ active = false }) {
    const store = useContext(StoreContext);
    const handleClick = () => {
        store.set("selecting", "waiting");
        console.log("Кликните по карте, чтобы добавить точку");
    };

    return (
        <button
            className={`add-place-btn ${active ? "add-place-btn--active" : ""}`}
            onClick={handleClick}
        >
            {active ? "Кликните по карте…" : "Добавить место"}
        </button>
    );
}