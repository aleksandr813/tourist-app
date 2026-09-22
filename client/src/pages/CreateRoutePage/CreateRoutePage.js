import { useState } from 'react';
import './CreateRoutePage.css';

export default function CreateRoutePage({ setPage, PAGES, selectedCity }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(1);

  function goBack() {
    setPage(PAGES.ROUTES);
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
            <input type="file" accept="image/*" />
          </label>

          <label className="create-route-page__field">
            <span>Название маршрута</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          <button type="button" className="create-route-page__next" disabled>
            Далее - расставить места на карте
          </button>
          <p className="create-route-page__note">
            Расстановка точек маршрута на карте пока в разработке.
          </p>
        </form>
      </div>
    </main>
  );
}
