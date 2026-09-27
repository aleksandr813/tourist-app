import CONFIG from '../Config';

export default function getImageUrl(path) {
  return `${CONFIG.STATIC_HOST}${path}`;
}
