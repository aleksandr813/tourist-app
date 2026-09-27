import { useState } from "react";

import "./AddPlaceCart.css"

export default function AddPlaceCart({ point, onSave, onCancel }) {
    const [name, setName] = useState(point.name);
    const [price, setPrice] = useState(point.price);
    const [description, setDescription] = useState(point.description);

    const isValid = name.trim() && price !== "" && Number(price) >= 0;

    const handleSave = () => {
        onSave({
            ...point,
            name: name.trim(),
            price: Number(price),
            description: description.trim(),
        });
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
                    placeholder="Название места"
                    autoFocus
                />

                <input
                    className="place-cart__input"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Средний чек, ₽"
                />

                <textarea
                    className="place-cart__input place-cart__textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание или совет"
                    rows={3}
                />

                <div className="place-cart__actions">
                    <button
                        className="place-cart__button place-cart__button--ghost"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                    <button className="place-cart__button" onClick={handleSave} disabled={!isValid}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
