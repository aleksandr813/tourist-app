const CONFIG = {
    TOKEN: process.env.BOT_TOKEN,
    NAME: process.env.BOT_NAME,
    API_URL: 'https://platform-api2.max.ru',
    POLLING_TIMEOUT: 30,
    RETRY_DELAY: 5000,
    UPDATE_TYPES: 'bot_started,message_created',
    START_PARAM: 'start',
    WELCOME_TEXT: 'Привет! Здесь можно найти готовые туристические маршруты по городам России с ценой каждого места или составить свой маршрут на карте. Нажмите кнопку ниже, чтобы открыть приложение.',
    OPEN_APP_TEXT: 'Открыть маршруты',
};

module.exports = CONFIG;
