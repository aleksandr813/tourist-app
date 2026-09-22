import { useContext, useEffect, useState } from 'react';
import RouteCard from './RouteCard';
import { ServerContext } from '../../App';
import CONFIG from '../../Config';
import './RoutesPage.css';

export default function RoutesPage({ selectedCity, setPage, PAGES }) {
  const server = useContext(ServerContext);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  useEffect(() => {
    async function getRoutes() {
      if (!selectedCity) {
        return;
      }

      const routesList = await server.getRoutesList({
        x: selectedCity.x,
        y: selectedCity.y,
        radius: CONFIG.defaultRoutesRadius,
      });

      setRoutes(routesList ?? []);
    }

    getRoutes();
  }, [selectedCity]);

  const selectedRoute = routes.find((route) => route.guid === selectedRouteId);

  return (
    <main className="routes-page">
      <div className="routes-page__content">
        <header className="routes-page__header">
          <h1>{selectedCity ? `Маршруты - ${selectedCity.city}` : 'Выберите маршрут'}</h1>
          <p>Найдите идею для прогулки и отправляйтесь открывать город.</p>
        </header>

        {routes.length > 0 ? (
          <ul className="routes-page__list" aria-label="Доступные маршруты">
            {routes.map((route) => (
              <li key={route.guid}>
                <RouteCard
                  route={route}
                  selected={route.guid === selectedRouteId}
                  onSelect={setSelectedRouteId}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="routes-page__empty">Пока нет маршрутов в этом городе.</p>
        )}

        <p className="routes-page__selection" role="status">
          {selectedRoute ? `Выбран маршрут: ${selectedRoute.title}` : 'Выберите один из маршрутов выше.'}
        </p>
      </div>

      <button
        type="button"
        className="routes-page__fab"
        aria-label="Добавить маршрут"
        onClick={() => setPage(PAGES.CREATE_ROUTE)}
      >
        +
      </button>
    </main>
  );
}
