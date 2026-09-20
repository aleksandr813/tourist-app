const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export default function RouteCard({ route, selected, onSelect }) {
  const { id, name, price, coordinates } = route;
  const titleId = `route-title-${id}`;

  return (
    <article className={`route-card${selected ? ' route-card--selected' : ''}`} aria-labelledby={titleId}>
      <h2 id={titleId}>{name}</h2>
      <dl className="route-card__details">
        <div>
          <dt>Цена</dt>
          <dd className="route-card__price">{price === 0 ? 'Бесплатно' : priceFormatter.format(price)}</dd>
        </div>
        <div>
          <dt>Координаты · широта, долгота</dt>
          <dd className="route-card__coordinates">
            {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
          </dd>
        </div>
      </dl>
      <button
        className="route-card__button"
        type="button"
        aria-pressed={selected}
        aria-label={`${selected ? 'Выбран маршрут' : 'Выбрать маршрут'}: ${name}`}
        onClick={() => onSelect(id)}
      >
        {selected ? 'Маршрут выбран' : 'Выбрать маршрут'}
      </button>
    </article>
  );
}
