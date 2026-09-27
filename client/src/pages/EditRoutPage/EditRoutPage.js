import { useContext, useEffect, useRef, useState } from "react";
import { Directions } from '@2gis/mapgl-directions';
import { load } from "@2gis/mapgl";
import { ServerContext, StoreContext } from "../../App";
import CONFIG from "../../Config";
import RouteToggleButton from "../../components/RouteToggleButton/RouteToggleButton";
import AddPlaceButton from "./AddPlaceButton/AddPlaceButton";
import AddPlaceCart from "./AddPlaceCart/AddPlaceCart";

import "./EditRoutPage.css";

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
    const [publishError, setPublishError] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isRouteVisible, setIsRouteVisible] = useState(true);

    const store = useContext(StoreContext);
    const server = useContext(ServerContext);
    const selectedCity = store.get("selectedCity");

    useEffect(() => {
        let cancelled = false;

        load()
            .then((mapglAPI) => {
                if (cancelled || !containerRef.current) return;

                const map = new mapglAPI.Map(containerRef.current, {
                    center: [selectedCity.x, selectedCity.y],
                    zoom: 10,
                    key: CONFIG.MAPGL_KEY,
                });
                mapRef.current = map;
                mapglAPIRef.current = mapglAPI;

                const directions = new Directions(map, {
                    directionsApiKey: CONFIG.MAPGL_KEY,
                });
                directionsRef.current = directions;

                map.on("click", (e) => {
                    if (store.get("selecting") !== "waiting") return;

                    const coords = e.lngLat;

                    setDraftPoint({
                        lng: coords[0],
                        lat: coords[1],
                        name: "",
                        price: "",
                        description: "",
                        photo: null,
                    });

                    store.set("selecting", "idle");
                    setIsSelecting(false);
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

    useEffect(() => {
        const directions = directionsRef.current;
        if (!directions) return;

        if (isRouteVisible && points.length >= 2) {
            directions.pedestrianRoute({
                points: points.map((p) => [p.lng, p.lat]),
            });
        } else {
            directions.clear();
        }
    }, [points, isRouteVisible]);

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
    };

    const toggleSelecting = () => {
        const nextIsSelecting = !isSelecting;
        store.set("selecting", nextIsSelecting ? "waiting" : "idle");
        setIsSelecting(nextIsSelecting);
    };

    const handleCancelPoint = () => {
        setDraftPoint(null);
    };

    function resetRoute() {
        store.set("points", []);
        store.set("selecting", "idle");
        setIsSelecting(false);
        setPoints([]);
        markersRef.current.forEach((m) => m.destroy());
        markersRef.current = [];
    }

    async function uploadPhotos(photos) {
        const urls = await Promise.all(
            photos.map((photo) => (photo ? server.uploadImage(photo) : null))
        );
        const isUploaded = urls.every((url, i) => !photos[i] || url);
        return isUploaded ? urls : null;
    }

    async function publishRoute() {
        setIsPublishing(true);
        setPublishError(null);

        const { cover, ...routeDraft } = store.get("route");
        const photoUrls = await uploadPhotos([cover, ...points.map((point) => point.photo)]);
        if (!photoUrls) {
            setPublishError("Не удалось загрузить фото");
            setIsPublishing(false);
            return;
        }
        const [coverUrl, ...placePhotoUrls] = photoUrls;

        const places = points.map(({ name, price, description, lng, lat }, i) => ({
            name,
            price,
            description,
            x: lng,
            y: lat,
            photo_url: placePhotoUrls[i],
        }));
        const route = {
            ...routeDraft,
            cost: places.reduce((sum, place) => sum + place.price, 0),
            x: selectedCity.x,
            y: selectedCity.y,
            author_id: store.get("userId"),
            city_guid: selectedCity.guid,
            photo_url: coverUrl,
        };

        const routeGuid = await server.addRoute(route, places);
        setIsPublishing(false);
        if (!routeGuid) {
            setPublishError("Не удалось опубликовать маршрут");
            return;
        }

        resetRoute();
        store.set("route", null);
        setPage(PAGES.ROUTES);
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
            <div
                ref={containerRef}
                className={`edit-route__map ${isSelecting ? "edit-route__map--selecting" : ""}`}
            />

            {isSelecting && (
                <p className="surface edit-route__hint">
                    Нажмите на карту, чтобы поставить метку
                </p>
            )}

            <div className="edit-route__panel">
                <AddPlaceButton active={isSelecting} onClick={toggleSelecting} />
                <button className="btn-secondary" onClick={resetRoute}>
                    Сбросить
                </button>
                <RouteToggleButton
                    visible={isRouteVisible}
                    onToggle={() => setIsRouteVisible(!isRouteVisible)}
                    disabled={points.length < 2}
                />
                <button
                    className="btn-secondary"
                    onClick={publishRoute}
                    disabled={points.length === 0 || isPublishing}
                >
                    {isPublishing ? "Публикуем…" : "Опубликовать"}
                </button>
                {publishError && (
                    <p className="surface edit-route__publish-error">{publishError}</p>
                )}

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

            {draftPoint && (
                <AddPlaceCart
                    point={draftPoint}
                    onSave={handleSavePoint}
                    onCancel={handleCancelPoint}
                />
            )}
        </div>
    );
}
