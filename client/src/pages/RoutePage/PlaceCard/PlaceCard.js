import formatPrice from '../../../utils/formatPrice';
import getImageUrl from '../../../utils/getImageUrl';
import PhotoCredit from '../../../components/PhotoCredit/PhotoCredit';

import './PlaceCard.css';

export default function PlaceCard({ place, number, onClose, onShowOnMap }) {
  return (
    <div className="place-card__overlay" onClick={onClose}>
      <article
        className="place-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-card-title"
      >
        <button type="button" className="place-card__close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        {place.photo_url && (
          <img className="place-card__photo" src={getImageUrl(place.photo_url)} alt="" />
        )}
        <PhotoCredit credit={place.photo_credit} className="place-card__credit" />

        <p className="place-card__number">Место {number}</p>
        <h2 className="place-card__title" id="place-card-title">{place.name}</h2>
        <p className="place-card__price">{formatPrice(place.price)}</p>
        {place.description && <p className="place-card__description">{place.description}</p>}

        <button type="button" className="place-card__button" onClick={onShowOnMap}>
          Показать на карте
        </button>
      </article>
    </div>
  );
}
