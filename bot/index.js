const CONFIG = require('./config');
const Bot = require('./Bot');

const { TOKEN, NAME, API_URL, POLLING_TIMEOUT, RETRY_DELAY, UPDATE_TYPES, START_PARAM, WELCOME_TEXT, OPEN_APP_TEXT } = CONFIG;

if (!TOKEN || !NAME) {
    console.log('BOT_TOKEN или BOT_NAME не заданы, бот не запущен');
} else {
    new Bot({
        token: TOKEN,
        apiUrl: API_URL,
        appLink: `https://max.ru/${NAME}?startapp=${START_PARAM}`,
        pollingTimeout: POLLING_TIMEOUT,
        retryDelay: RETRY_DELAY,
        updateTypes: UPDATE_TYPES,
        welcomeText: WELCOME_TEXT,
        openAppText: OPEN_APP_TEXT,
    }).start();
}
