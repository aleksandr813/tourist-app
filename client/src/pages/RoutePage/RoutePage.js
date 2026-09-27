import { useContext, useEffect, useState } from 'react';
import { ServerContext, StoreContext } from '../../App';
import LikeButton from '../../components/LikeButton/LikeButton';
import formatPrice from '../../utils/formatPrice';
import getImageUrl from '../../utils/getImageUrl';
import PlaceCard from './PlaceCard/PlaceCard';
import RouteMap from './RouteMap/RouteMap';

import './RoutePage.css';

export default function RoutePage({ setPage, PAGES }) {
  const server = useContext(ServerContext);
  const store = useContext(StoreContext);
  const [route, setRoute] = useState(store.get('selectedRoute'));
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openedPlace, setOpenedPlace] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [focusedPlace, setFocusedPlace] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function getPlaces() {
      const placesList = await server.getPlaces(route.guid);
      if (cancelled) {
        return;
      }
      setPlaces(placesList ?? []);
      setIsLoading(false);
    }

    getPlaces();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateLikes(changes) {
    const updatedRoute = { ...route, ...changes };
    setRoute(updatedRoute);
    store.set('selectedRoute', updatedRoute);
  }

  function openMap(place) {
    setFocusedPlace(place);
    setOpenedPlace(null);
    setIsMapOpen(true);
  }

  const placeCard = openedPlace && (
    <PlaceCard
      place={openedPlace}
      number={places.indexOf(openedPlace) + 1}
      onClose={() => setOpenedPlace(null)}
      onShowOnMap={() => openMap(openedPlace)}
    />
  );

  if (isMapOpen) {
    return (
      <>
        <RouteMap
          places={places}
          focusedPlace={focusedPlace}
          onPlaceClick={setOpenedPlace}
          onBack={() => setIsMapOpen(false)}
        />
        {placeCard}
      </>
    );
  }

  return (
    <main className="route-page">
      <div className="route-page__content">
        <button type="button" className="route-page__back" onClick={() => setPage(PAGES.ROUTES)}>
          ← К маршрутам
        </button>

        {route.photo_url && (
          <img className="route-page__cover" src={getImageUrl(route.photo_url)} alt="" />
        )}

        <header className="route-page__header">
          <h1>{route.name || route.title}</h1>
          {route.name && <p className="route-page__description">{route.title}</p>}
          <div className="route-page__summary">
            <p className="route-page__price">{formatPrice(route.cost)}</p>
            <LikeButton
              routeGuid={route.guid}
              liked={route.liked}
              likes={route.likes}
              onChange={updateLikes}
            />
          </div>
        </header>

        <button
          type="button"
          className="route-page__map-button"
          onClick={() => openMap(null)}
          disabled={places.length === 0}
        >
          Карта маршрута
        </button>

        <section aria-labelledby="route-places-title">
          <h2 className="route-page__places-title" id="route-places-title">
            Места ({places.length})
          </h2>

          {isLoading && <p className="route-page__status">Загружаем места…</p>}
          {!isLoading && places.length === 0 && (
            <p className="route-page__status">В маршруте пока нет мест</p>
          )}

          <ol className="route-page__places">
            {places.map((place, index) => (
              <li key={place.guid}>
                <button type="button" className="route-place" onClick={() => setOpenedPlace(place)}>
                  <span className="route-place__number">{index + 1}</span>
                  {place.photo_url ? (
                    <img className="route-place__photo" src={getImageUrl(place.photo_url)} alt="" />
                  ) : (
                    <span className="route-place__photo route-place__photo--empty" />
                  )}
                  <span className="route-place__info">
                    <span className="route-place__name">{place.name}</span>
                    <span className="route-place__price">{formatPrice(place.price)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {placeCard}
    </main>
  );
}
