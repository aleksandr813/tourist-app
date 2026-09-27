import LikeButton from '../../components/LikeButton/LikeButton';
import formatPrice from '../../utils/formatPrice';
import getImageUrl from '../../utils/getImageUrl';

export default function RouteCard({ route, onOpen, onLikeChange }) {
  const { guid, name, title, cost, photo_url, likes, liked } = route;
  const titleId = `route-title-${guid}`;

  return (
    <article className="route-card" aria-labelledby={titleId}>
      {photo_url && (
        <img className="route-card__cover" src={getImageUrl(photo_url)} alt="" />
      )}
      <h2 id={titleId}>{name || title}</h2>
      <dl className="route-card__details">
        <div>
          <dt>Цена</dt>
          <dd className="route-card__price">{formatPrice(cost)}</dd>
        </div>
      </dl>
      <div className="route-card__actions">
        <LikeButton routeGuid={guid} liked={liked} likes={likes} onChange={onLikeChange} />
        <button
          className="route-card__button"
          type="button"
          aria-label={`Открыть маршрут: ${name || title}`}
          onClick={() => onOpen(route)}
        >
          Подробнее
        </button>
      </div>
    </article>
  );
}
