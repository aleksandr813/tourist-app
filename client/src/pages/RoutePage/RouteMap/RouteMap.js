import { useEffect, useRef, useState } from 'react';
import { Directions } from '@2gis/mapgl-directions';
import { load } from '@2gis/mapgl';
import CONFIG from '../../../Config';
import RouteToggleButton from '../../../components/RouteToggleButton/RouteToggleButton';

import './RouteMap.css';

const MARKER_SIZE = 32;
const ROUTE_ZOOM = 13;
const PLACE_ZOOM = 16;
const BOUNDS_PADDING = { top: 96, right: 48, bottom: 48, left: 48 };

const getCoordinates = (place) => [place.x, place.y];

const createMarkerIcon = (number) =>
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MARKER_SIZE}" height="${MARKER_SIZE}" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="13" fill="#8a2be2" stroke="#ffffff" stroke-width="3"/>
      <text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#ffffff">${number}</text>
    </svg>`
  );

const getBounds = (places) => {
  const xs = places.map((place) => place.x);
  const ys = places.map((place) => place.y);
  return {
    southWest: [Math.min(...xs), Math.min(...ys)],
    northEast: [Math.max(...xs), Math.max(...ys)],
  };
};

export default function RouteMap({ places, focusedPlace, onPlaceClick, onBack }) {
  const containerRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isRouteVisible, setIsRouteVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let map = null;
    let mapDirections = null;

    load()
      .then((mapglAPI) => {
        if (cancelled || !containerRef.current) return;

        map = new mapglAPI.Map(containerRef.current, {
          center: getCoordinates(focusedPlace ?? places[0]),
          zoom: focusedPlace ? PLACE_ZOOM : ROUTE_ZOOM,
          key: CONFIG.MAPGL_KEY,
        });

        places.forEach((place, index) => {
          const marker = new mapglAPI.Marker(map, {
            coordinates: getCoordinates(place),
            icon: createMarkerIcon(index + 1),
            size: [MARKER_SIZE, MARKER_SIZE],
            anchor: [MARKER_SIZE / 2, MARKER_SIZE / 2],
          });
          marker.on('click', () => onPlaceClick(place));
        });

        mapDirections = new Directions(map, { directionsApiKey: CONFIG.MAPGL_KEY });
        setDirections(mapDirections);

        if (!focusedPlace && places.length >= 2) {
          map.fitBounds(getBounds(places), { padding: BOUNDS_PADDING });
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(error);
        setMapError(error.message);
      });

    return () => {
      cancelled = true;
      setDirections(null);
      mapDirections?.clear();
      map?.destroy();
    };
  }, [places, focusedPlace, onPlaceClick]);

  useEffect(() => {
    if (!directions) return;

    if (isRouteVisible && places.length >= 2) {
      directions.pedestrianRoute({ points: places.map(getCoordinates) });
    } else {
      directions.clear();
    }
  }, [directions, isRouteVisible, places]);

  return (
    <div className="route-map">
      {mapError ? (
        <p className="route-map__error">Не удалось загрузить карту: {mapError}</p>
      ) : (
        <div ref={containerRef} className="route-map__container" />
      )}

      <button type="button" className="route-map__back" onClick={onBack}>
        ← К маршруту
      </button>

      {places.length >= 2 && (
        <RouteToggleButton
          className="route-map__route-toggle"
          visible={isRouteVisible}
          onToggle={() => setIsRouteVisible(!isRouteVisible)}
        />
      )}
    </div>
  );
}
