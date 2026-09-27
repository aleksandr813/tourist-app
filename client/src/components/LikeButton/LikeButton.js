import { useContext, useState } from 'react';
import { ServerContext, StoreContext } from '../../App';

import './LikeButton.css';

export default function LikeButton({ routeGuid, liked, likes, onChange }) {
  const server = useContext(ServerContext);
  const store = useContext(StoreContext);
  const userId = store.get('userId');
  const [isPending, setIsPending] = useState(false);

  async function toggleLike() {
    setIsPending(true);
    const result = await server.toggleLike(routeGuid, userId);
    setIsPending(false);
    if (result) {
      onChange(result);
    }
  }

  return (
    <button
      type="button"
      className={`like-button ${liked ? 'like-button--liked' : ''}`}
      onClick={toggleLike}
      disabled={!userId || isPending}
      aria-pressed={Boolean(liked)}
      aria-label={liked ? 'Убрать лайк' : 'Поставить лайк'}
      title={userId ? undefined : 'Лайки доступны в приложении MAX'}
    >
      <span className="like-button__icon" aria-hidden="true">{liked ? '♥' : '♡'}</span>
      {likes}
    </button>
  );
}
