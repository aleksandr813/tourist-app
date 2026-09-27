export default class Max {

    getUserId() {
        return window.WebApp?.initDataUnsafe?.user?.id ?? null;
    }

}
