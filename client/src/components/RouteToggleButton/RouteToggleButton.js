import './RouteToggleButton.css';

export default function RouteToggleButton({ visible, onToggle, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      className={`route-toggle ${visible ? 'route-toggle--visible' : ''} ${className}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={visible}
    >
      {visible ? 'Скрыть маршрут' : 'Показать маршрут'}
    </button>
  );
}
