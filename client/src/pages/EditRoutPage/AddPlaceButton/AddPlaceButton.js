import "./AddPlaceButton.css"

export default function AddPlaceButton({ active = false, onClick }) {
    return (
        <button
            className={`add-place-btn ${active ? "add-place-btn--active" : ""}`}
            onClick={onClick}
        >
            {active ? "Выберите место на карте" : "Добавить место"}
        </button>
    );
}
