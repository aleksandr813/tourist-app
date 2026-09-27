import { useContext, useState } from 'react';
import { StoreContext } from '../../App';
import './CreateRoutePage.css';

export default function CreateRoutePage({ setPage, PAGES }) {
  const store = useContext(StoreContext);
  const selectedCity = store.get('selectedCity');
  const routeDraft = store.get('route');
  const [name, setName] = useState(routeDraft?.name ?? '');
  const [title, setTitle] = useState(routeDraft?.title ?? '');
  const [cover, setCover] = useState(routeDraft?.cover ?? null);
  const [durationDays, setDurationDays] = useState(1);

  function goBack() {
    setPage(PAGES.ROUTES);
  }

  function goToPlaces() {
    store.set('route', { name: name.trim(), title: title.trim(), cover });
    setPage(PAGES.EDIT);
  }

  return (
    <main className="create-route-page">
      <div className="create-route-page__content">
        <header className="create-route-page__header">
          <button type="button" className="create-route-page__back" onClick={goBack}>
            ← Назад
          </button>
          <h1>Новый маршрут</h1>
          <p>Шаг 1 из 3 - общая информация о маршруте</p>
        </header>

        <form className="create-route-page__form" onSubmit={(e) => e.preventDefault()}>
          <label className="create-route-page__field">
            <span>Обложка маршрута</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setCover(e.target.files[0] ?? null)}
            />
            {cover && <span className="create-route-page__file">Выбрано: {cover.name}</span>}
          </label>

          <label className="create-route-page__field">
            <span>Название маршрута</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, «Исторический центр за день»"
            />
          </label>

          <label className="create-route-page__field">
            <span>Город</span>
            <input type="text" value={selectedCity ? selectedCity.city : ''} disabled />
          </label>

          <label className="create-route-page__field">
            <span>Описание</span>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={4}
              placeholder="Для кого этот маршрут, что стоит знать заранее"
            />
          </label>

          <fieldset className="create-route-page__field create-route-page__duration">
            <legend>Длительность</legend>
            <label>
              <input
                type="radio"
                name="duration"
                checked={durationDays === 1}
                onChange={() => setDurationDays(1)}
              />
              1 день
            </label>
            <label>
              <input
                type="radio"
                name="duration"
                checked={durationDays === 2}
                onChange={() => setDurationDays(2)}
              />
              2 дня
            </label>
          </fieldset>

          <button
            type="button"
            className="create-route-page__next"
            disabled={!name.trim() || !title.trim()}
            onClick={goToPlaces}
          >
            Далее - расставить места на карте
          </button>
        </form>
      </div>
    </main>
  );
}
