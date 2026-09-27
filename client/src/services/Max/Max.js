import CONFIG from "../../Config";

export default class Max {

    getUserId() {
        const userId = window.WebApp?.initDataUnsafe?.user?.id;
        if (userId) {
            return userId;
        }
        return process.env.NODE_ENV === "development" ? CONFIG.DEV_USER_ID : null;
    }

    getInitData() {
        return window.WebApp?.initData || null;
    }

    getStartParam() {
        return window.WebApp?.initDataUnsafe?.start_param ?? null;
    }

    getSharedRouteGuid() {
        const startParam = this.getStartParam();
        return startParam?.startsWith(CONFIG.SHARE_ROUTE_PREFIX)
            ? startParam.slice(CONFIG.SHARE_ROUTE_PREFIX.length)
            : null;
    }

    canShare() {
        return Boolean(window.WebApp?.shareMaxContent && CONFIG.BOT_NAME);
    }

    shareRoute(route) {
        return window.WebApp.shareMaxContent({
            text: `${route.name || route.title} - маршрут в приложении «Маршруты»`,
            link: `https://max.ru/${CONFIG.BOT_NAME}?startapp=${CONFIG.SHARE_ROUTE_PREFIX}${route.guid}`,
        });
    }

    showBackButton(onClick) {
        const backButton = window.WebApp?.BackButton;
        if (!backButton) {
            return;
        }
        backButton.onClick(onClick);
        backButton.show();
    }

    hideBackButton(onClick) {
        const backButton = window.WebApp?.BackButton;
        if (!backButton) {
            return;
        }
        backButton.offClick(onClick);
        backButton.hide();
    }

}
