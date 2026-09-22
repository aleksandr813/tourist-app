const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export default function RouteCard({ route, selected, onSelect }) {
  const { guid, title, cost, x, y } = route;
  const titleId = `route-title-${guid}`;

  return (
    <article className={`route-card${selected ? ' route-card--selected' : ''}`} aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <dl className="route-card__details">
        <div>
          <dt>Цена</dt>
          <dd className="route-card__price">{!cost ? 'Бесплатно' : priceFormatter.format(cost)}</dd>
        </div>
        <div>
          <dt>Координаты</dt>
          <dd className="route-card__coordinates">
            {x}, {y}
          </dd>
        </div>
      </dl>
      <button
        className="route-card__button"
        type="button"
        aria-pressed={selected}
        aria-label={`${selected ? 'Выбран маршрут' : 'Выбрать маршрут'}: ${title}`}
        onClick={() => onSelect(guid)}
      >
        {selected ? 'Маршрут выбран' : 'Выбрать маршрут'}
      </button>
    </article>
  );
}
