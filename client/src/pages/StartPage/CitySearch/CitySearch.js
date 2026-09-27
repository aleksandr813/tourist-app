import { useEffect, useState } from "react";

import "./CitySearch.css";

const SUGGESTIONS_LIMIT = 8;

const normalize = (text) => text.trim().toLowerCase().replaceAll("ё", "е");

function findCities(cities, query) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
        return [];
    }

    const startsWithQuery = [];
    const containsQuery = [];
    cities.forEach((city) => {
        const name = normalize(city.city);
        if (name.startsWith(normalizedQuery)) {
            startsWithQuery.push(city);
        } else if (name.includes(normalizedQuery)) {
            containsQuery.push(city);
        }
    });

    return [...startsWithQuery, ...containsQuery].slice(0, SUGGESTIONS_LIMIT);
}

export default function CitySearch({ cities, value, onChange }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (value) {
            setQuery(value.city);
        }
    }, [value]);

    const suggestions = findCities(cities, query);
    const isListVisible = isOpen && query.trim() !== "";

    function selectCity(city) {
        onChange(city);
        setQuery(city.city);
        setIsOpen(false);
    }

    function handleInput(e) {
        setQuery(e.target.value);
        setIsOpen(true);
        setActiveIndex(0);
        if (value) {
            onChange(null);
        }
    }

    function handleKeyDown(e) {
        if (!isListVisible || suggestions.length === 0) {
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((activeIndex + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((activeIndex - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            selectCity(suggestions[activeIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    }

    return (
        <div className="city-search">
            <input
                className="city-search__input"
                type="text"
                value={query}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                placeholder="Начните вводить город..."
                autoComplete="off"
                role="combobox"
                aria-expanded={isListVisible}
                aria-controls="city-search-list"
                aria-autocomplete="list"
            />

            {isListVisible && (
                <ul className="city-search__list" id="city-search-list" role="listbox">
                    {suggestions.length === 0 ? (
                        <li className="city-search__empty">Город не найден</li>
                    ) : (
                        suggestions.map((city, index) => (
                            <li
                                key={city.guid}
                                className={`city-search__option ${index === activeIndex ? "city-search__option--active" : ""}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => selectCity(city)}
                            >
                                <span className="city-search__name">{city.city}</span>
                                <span className="city-search__region">{city.region}</span>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}
