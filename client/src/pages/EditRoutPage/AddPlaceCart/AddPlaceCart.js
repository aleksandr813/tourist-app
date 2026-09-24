// AddPlaceCart.jsx
import { useState } from "react";

import "./AddPlaceCart.css"

export default function AddPlaceCart({ point, onSave, onCancel }) {
    const [name, setName] = useState(point?.name || "");

    if (!point) return null;

    const handleSave = () => {
        onSave({ ...point, name: name.trim() });
    };

    return (
        <div className="place-cart__overlay" onClick={onCancel}>
            <div className="place-cart" onClick={(e) => e.stopPropagation()}>
                <h3 className="place-cart__title">Новая точка</h3>

                <p className="place-cart__coords">
                    {point.lng.toFixed(5)}, {point.lat.toFixed(5)}
                </p>

                <input
                    className="place-cart__input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Название точки"
                    autoFocus
                />

                <div className="place-cart__actions">
                    <button
                        className="place-cart__button place-cart__button--ghost"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button className="place-cart__button" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}