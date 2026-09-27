const EARTH_RADIUS_KM = 6371;
const POSITION_TIMEOUT_MS = 10000;
const POSITION_MAX_AGE_MS = 10 * 60 * 1000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export default class Geo {

    getPosition() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                ({ coords }) => resolve({ x: coords.longitude, y: coords.latitude }),
                () => resolve(null),
                { timeout: POSITION_TIMEOUT_MS, maximumAge: POSITION_MAX_AGE_MS },
            );
        });
    }

    getDistance(from, to) {
        const dLat = toRadians(to.y - from.y);
        const dLng = toRadians(to.x - from.x);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(from.y)) * Math.cos(toRadians(to.y)) * Math.sin(dLng / 2) ** 2;
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
    }

    findNearest(cities, position) {
        return cities.reduce((nearest, city) =>
            !nearest || this.getDistance(position, city) < this.getDistance(position, nearest)
                ? city
                : nearest,
        null);
    }

}
