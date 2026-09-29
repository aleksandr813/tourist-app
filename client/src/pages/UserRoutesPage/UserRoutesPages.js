import { useCallback, useContext, useEffect, useState } from 'react';
import RouteCard from '../RoutesPage/RouteCard';
import { ServerContext, StoreContext } from '../../App';
import useMaxBackButton from '../../hooks/useMaxBackButton';
import '../RoutesPage/RoutesPage.css';

export default function UserRoutesPage({ setPage, PAGES }) {
  const server = useContext(ServerContext);
  const store = useContext(StoreContext);
  const userId = store.get('userId');

  const [routes, setRoutes] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [page, setPageNumber] = useState(store.get('userRoutesPage') ?? 1);
  const [pagesCount, setPagesCount] = useState(0);

  const goBack = useCallback(() => setPage(PAGES.ROUTES), [setPage, PAGES]);
  useMaxBackButton(goBack);

  useEffect(() => {
    let cancelled = false;

    async function getRoutes() {
      setIsLoading(true);
      setLoadError(null);

      store.set('userRoutesPage', page);

      const userRoutesPage = await server.getUserRoutesList(userId, page);
      if (cancelled) {
        return;
      }

      setIsLoading(false);
      if (!userRoutesPage) {
        setLoadError('Не удалось загрузить маршруты');
        return;
      }

      setRoutes(userRoutesPage.routes);
      setPagesCount(userRoutesPage.pagesCount ?? 0);
      window.scrollTo(0, 0);
    }

    getRoutes();

    return () => {
      cancelled = true;
    };
  }, [attempt, page]);

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
          <button type="button" className="routes-page__change-city" onClick={goBack}>
            ← Назад
          </button>
          <h1>Мои маршруты</h1>
        </header>

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
          <ul className="routes-page__list" aria-label="Мои маршруты">
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
          !loadError && !isLoading && <p className="routes-page__empty">Вы пока не создали ни одного маршрута.</p>
        )}

        {pagesCount > 1 && (
          <nav className="routes-page__pagination" aria-label="Страницы моих маршрутов">
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