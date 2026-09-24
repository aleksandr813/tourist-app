import { useContext, useEffect, useRef, useState } from "react";
import { Directions } from '@2gis/mapgl-directions';
import { load } from "@2gis/mapgl";
import { StoreContext } from "../../App";
import AddPlaceButton from "./AddPlaceButton/AddPlaceButton";
import AddPlaceCart from "./AddPlaceCart/AddPlaceCart";

import "./EditRoutPage.css";

const MAPGL_KEY = "3437ff1b-602e-4a97-a906-169b3493070a";

const MARKER_ICON =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="10" fill="#8a2be2" stroke="#ffffff" stroke-width="3"/>
        </svg>`
    );

export default function EditRoutPage({ setPage, PAGES }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const mapglAPIRef = useRef(null);
    const directionsRef = useRef(null);
    const markersRef = useRef([]);
    
    
    const [mapError, setMapError] = useState(null);
    const [points, setPoints] = useState([]);
    const [draftPoint, setDraftPoint] = useState(null);


    const store = useContext(StoreContext);

    useEffect(() => {
        let cancelled = false;

        load()
            .then((mapglAPI) => {
                if (cancelled || !containerRef.current) return;

                const map = new mapglAPI.Map(containerRef.current, {
                    center: [37.618423, 55.751244],
                    zoom: 10,
                    key: MAPGL_KEY,
                });
                mapRef.current = map;
                mapglAPIRef.current = mapglAPI;

                const directions = new Directions(map, {
                    directionsApiKey: MAPGL_KEY,
                });
                directionsRef.current = directions;

                map.on("click", (e) => {
                    if (store.get("selecting") !== "waiting") return;

                    const coords = e.lngLat;

                    setDraftPoint({
                        lng: coords[0],
                        lat: coords[1],
                        name: "",
                    });

                    store.set("selecting", "idle");
                });
            })

            .catch((error) => {
                if (cancelled) return;
                console.error(error);
                setMapError(error.message);
            });

        return () => {
            cancelled = true;
            mapRef.current?.destroy();
            mapRef.current = null;
            markersRef.current = [];
            mapRef.current?.destroy();
            directionsRef.current?.clear();
            directionsRef.current = null;
        };
    }, []);


    const handleSavePoint = (point) => {
        const newPoints = [...(store.get("points") || []), point];
        store.set("points", newPoints);
        setPoints(newPoints);
        setDraftPoint(null);

        const map = mapRef.current;
        const mapglAPI = mapglAPIRef.current
        if (map && mapglAPI) {
            const marker = new mapglAPI.Marker(map, {
                coordinates: [point.lng, point.lat],
                icon: MARKER_ICON,
                size: [28, 28],
                anchor: [14, 14],
            });
            markersRef.current.push(marker);
        }

        if (newPoints.length >= 2) {
            directionsRef.current?.pedestrianRoute({
                points: newPoints.map((p) => [p.lng, p.lat]),
            });
        }
    };

    const handleCancelPoint = () => {
        setDraftPoint(null);
    };

    function resetRoute() {
        store.set("points", []);
        store.set("selecting", "idle");
        setPoints([]);
        directionsRef.current?.clear();
        markersRef.current.forEach((m) => m.destroy());
        markersRef.current = [];
    }
              

    if (mapError) {
        return (
            <div>
                <p>Не удалось загрузить карту.</p>
                <p>{mapError}</p>
            </div>
        );
    }

    return (
        <div className="edit-route">
            <div ref={containerRef} className="edit-route__map" />

            <div className="edit-route__panel">
                <AddPlaceButton/>
                <button className="btn-secondary" onClick={resetRoute}>
                    Сбросить
                </button>

                <div className="surface points-list">
                    <p className="points-list__title">Точки</p>
                    {points.length === 0 ? (
                        <p className="points-list__empty">Точек пока нет</p>
                    ) : (
                        points.map((p, i) => (
                            <div className="points-list__item" key={i}>
                                <span className="points-list__index">{i + 1}</span>
                                <span className="points-list__name">
                                    {p.name || "(без имени)"}
                                </span>
                                <span className="points-list__coords">
                                    {p.lng.toFixed(4)}, {p.lat.toFixed(4)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AddPlaceCart
                point={draftPoint}
                onSave={handleSavePoint}
                onCancel={handleCancelPoint}
            />
        </div>
    );
}
