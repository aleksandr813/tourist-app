import CONFIG from "../../Config";

export default class Max {

    getUserId() {
        const userId = window.WebApp?.initDataUnsafe?.user?.id;
        if (userId) {
            return userId;
        }
        return process.env.NODE_ENV === "development" ? CONFIG.DEV_USER_ID : null;
    }

}
