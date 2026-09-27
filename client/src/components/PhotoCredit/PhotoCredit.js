import './PhotoCredit.css';

export default function PhotoCredit({ credit, className = '' }) {
  if (!credit) {
    return null;
  }

  return <p className={`photo-credit ${className}`}>{credit}</p>;
}
