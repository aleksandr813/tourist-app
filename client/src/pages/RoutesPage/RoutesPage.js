import { useCallback, useContext, useEffect, useState } from 'react';
import RouteCard from './RouteCard';
import { ServerContext, StoreContext } from '../../App';
import useMaxBackButton from '../../hooks/useMaxBackButton';
import './RoutesPage.css';

const SORTS = [
  { value: 'date', label: 'Новые' },
  { value: 'likes', label: 'Популярные' },
];

export default function RoutesPage({ setPage, PAGES }) {
  const server = useContext(ServerContext);
  const store = useContext(StoreContext);
  const selectedCity = store.get("selectedCity");
  const [routes, setRoutes] = useState([]);
  const [sort, setSort] = useState(store.get('routesSort') ?? SORTS[0].value);
  const [page, setPageNumber] = useState(store.get('routesPage') ?? 1);
  const [pagesCount, setPagesCount] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const goToCities = useCallback(() => setPage(PAGES.START), [setPage, PAGES]);
  useMaxBackButton(goToCities);

  useEffect(() => {
    let cancelled = false;

    async function getRoutes() {
      if (!selectedCity) {
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      const routesPage = await server.getRoutesList({
        city: selectedCity.guid,
        user: store.get('userId'),
        sort,
        page,
      });
      if (cancelled) {
        return;
      }

      setIsLoading(false);
      if (!routesPage) {
        setLoadError('Не удалось загрузить маршруты');
        return;
      }

      setLoadError(null);
      setRoutes(routesPage.routes);
      setPagesCount(routesPage.pagesCount);
      window.scrollTo(0, 0);
    }

    store.set('routesSort', sort);
    store.set('routesPage', page);
    getRoutes();

    return () => {
      cancelled = true;
    };
  }, [sort, page, attempt]);

  function changeSort(value) {
    setSort(value);
    setPageNumber(1);
  }

  function updateRoute(guid, changes) {
    setRoutes(routes.map((route) => (route.guid === guid ? { ...route, ...changes } : route)));
  }

  function openRoute(route) {
    store.set('selectedRoute', route);
    setPage(PAGES.ROUTE);
  }

  return (
    <main className="routes-page">
      <div className="routes-page__content">
        <header className="routes-page__header">
          <button type="button" className="routes-page__change-city" onClick={goToCities}>
            ← Сменить город
          </button>
          <h1>{selectedCity ? `Маршруты - ${selectedCity.city}` : 'Выберите маршрут'}</h1>
          <p>Найдите идею для прогулки и отправляйтесь открывать город.</p>
        </header>

        <div className="routes-page__sort" role="group" aria-label="Сортировка маршрутов">
          {SORTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`routes-page__sort-button ${sort === value ? 'routes-page__sort-button--active' : ''}`}
              aria-pressed={sort === value}
              onClick={() => changeSort(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {loadError && (
          <div className="routes-page__error" role="alert">
            <p>{loadError}</p>
            <button type="button" className="routes-page__page-button" onClick={() => setAttempt(attempt + 1)}>
              Повторить
            </button>
          </div>
        )}

        {isLoading && !loadError && (
          <p className="routes-page__status" role="status">Загружаем маршруты...</p>
        )}

        {routes.length > 0 ? (
          <ul className="routes-page__list" aria-label="Доступные маршруты">
            {routes.map((route) => (
              <li key={route.guid}>
                <RouteCard
                  route={route}
                  onOpen={openRoute}
                  onLikeChange={(changes) => updateRoute(route.guid, changes)}
                />
              </li>
            ))}
          </ul>
        ) : (
          !loadError && !isLoading && <p className="routes-page__empty">Пока нет маршрутов в этом городе.</p>
        )}

        {pagesCount > 1 && (
          <nav className="routes-page__pagination" aria-label="Страницы маршрутов">
            <button
              type="button"
              className="routes-page__page-button"
              onClick={() => setPageNumber(page - 1)}
              disabled={page <= 1}
            >
              ← Назад
            </button>
            <span className="routes-page__page-info">
              {page} из {pagesCount}
            </span>
            <button
              type="button"
              className="routes-page__page-button"
              onClick={() => setPageNumber(page + 1)}
              disabled={page >= pagesCount}
            >
              Вперёд →
            </button>
          </nav>
        )}
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
