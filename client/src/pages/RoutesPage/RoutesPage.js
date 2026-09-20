import { useState } from 'react';
import RouteCard from './RouteCard';
import './RoutesPage.css';

// Временные данные: позже этот список можно заменить ответом сервера.
const routes = [
  {
    id: 1,
    name: 'Прогулка по набережной Москвы-реки',
    price: 500,
    coordinates: { latitude: 55.7446, longitude: 37.6055 },
  },
  {
    id: 2,
    name: 'Исторический центр Москвы',
    price: 900,
    coordinates: { latitude: 55.7539, longitude: 37.6208 },
  },
  {
    id: 3,
    name: 'Прогулка по парку Горького',
    price: 0,
    coordinates: { latitude: 55.7298, longitude: 37.6010 },
  },
];

export default function RoutesPage() {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const selectedRoute = routes.find((route) => route.id === selectedRouteId);

  return (
    <main className="routes-page">
      <div className="routes-page__content">
        <header className="routes-page__header">
          <h1>Выберите маршрут</h1>
          <p>Найдите идею для прогулки и отправляйтесь открывать город.</p>
        </header>

        {routes.length > 0 ? (
          <ul className="routes-page__list" aria-label="Доступные маршруты">
            {routes.map((route) => (
              <li key={route.id}>
                <RouteCard
                  route={route}
                  selected={route.id === selectedRouteId}
                  onSelect={setSelectedRouteId}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="routes-page__empty">Пока нет доступных маршрутов.</p>
        )}

        <p className="routes-page__selection" role="status">
          {selectedRoute ? `Выбран маршрут: ${selectedRoute.name}` : 'Выберите один из маршрутов выше.'}
        </p>
      </div>
    </main>
  );
}
