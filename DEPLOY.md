# Установка через Docker

Приложение состоит из трёх контейнеров:

- `server` - API на Node.js (Express, SQLite). Наружу не публикуется.
- `client` - собранный React-клиент в nginx. Он же проксирует запросы `/api`, `/images` и `/uploads` в контейнер `server`, поэтому клиент и API работают на одном адресе.
- `bot` - бот MAX: на запуск и сообщения отвечает приветствием с кнопкой открытия мини-приложения. Портов не открывает.

Контейнер `client` слушает только `127.0.0.1:8080`. Чтобы приложение открывалось в MAX, перед ним нужен обратный прокси с HTTPS (раздел 5): мини-приложения MAX работают только по защищённому соединению.

Данные хранятся в Docker-томах и не теряются при пересборке и обновлении:

- `server-data` - база `data.db`. При первом запуске в том копируется база из репозитория (1117 городов и 25 маршрутов).
- `server-uploads` - картинки, которые загружают пользователи.

## 1. Требования

- Linux-сервер или локальная машина с Docker Engine и плагином Docker Compose v2. Установка: https://docs.docker.com/engine/install/
- Для работы в MAX: домен, направленный на сервер (A-запись), и открытые порты 80 и 443.

Проверьте, что Docker и Compose доступны:

```bash
docker --version
docker compose version
```

## 2. Загрузка проекта

```bash
git clone https://github.com/aleksandr813/tourist-app
cd tourist-app
```

Можно скопировать проект архивом. Папки `node_modules` и `client/build` переносить не нужно, всё собирается внутри контейнеров.

## 3. Переменные окружения

Создайте файл `.env` из шаблона и заполните его:

```bash
cp .env.example .env
nano .env
```

| Переменная | Что указать |
|---|---|
| `MAPGL_KEY` | Ключ 2GIS MapGL JS API из кабинета https://platform.2gis.ru |
| `BOT_TOKEN` | Токен бота MAX, выданный организаторами |
| `BOT_NAME` | Ник бота без `@` |
| `ALLOW_ANONYMOUS_ROUTES` | `false` для рабочего запуска |
| `CLIENT_PORT` | Порт клиента на `127.0.0.1`, по умолчанию `8080` |

Файл `.env` не попадает в git. Не публикуйте его и не пересылайте в открытых каналах.

С заданным `BOT_TOKEN` сервер принимает id пользователя только из подписанных данных MAX, поэтому лайки и публикация работают только внутри MAX. Если ключ 2GIS раньше лежал в коде репозитория, перевыпустите его в кабинете 2GIS и укажите новый.

`MAPGL_KEY` и `BOT_NAME` встраиваются в клиент при сборке, после их изменения клиент нужно пересобрать (`docker compose up -d --build`).

### Публикация маршрутов без MAX (для тестирования)

По умолчанию маршрут может опубликовать только пользователь MAX. Чтобы проверить создание маршрутов в обычном браузере, поставьте в `.env` значение `ALLOW_ANONYMOUS_ROUTES=true` и выполните `docker compose up -d`. Такие маршруты сохраняются с автором `anonymous`. Для рабочего запуска верните `false`.

## 4. Запуск

```bash
docker compose up -d --build
```

Первая сборка занимает несколько минут. Проверьте, что всё запустилось:

```bash
docker compose ps
curl http://127.0.0.1:8080/api/getCities | head -c 200
```

Должен прийти JSON со списком городов. Приложение открывается на `http://localhost:8080` (на сервере - через прокси из раздела 5).

Проверьте, что бот запущен:

```bash
docker compose logs bot
```

В логе должна быть строка `Bot started`. Если там `BOT_TOKEN или BOT_NAME не заданы`, проверьте `.env` и выполните `docker compose up -d`.

Если порт 8080 уже занят, поменяйте `CLIENT_PORT` в `.env` и выполните `docker compose up -d`.

## 5. HTTPS

Поставьте перед контейнером `client` любой обратный прокси с сертификатом и направьте его на `http://127.0.0.1:8080`. Ниже два варианта.

### Вариант 1: Caddy (сертификат выпускается автоматически)

Установка: https://caddyserver.com/docs/install. Файл `/etc/caddy/Caddyfile`:

```
routes.example.ru {
    reverse_proxy 127.0.0.1:8080
}
```

```bash
sudo systemctl reload caddy
```

### Вариант 2: nginx и certbot

Файл `/etc/nginx/sites-available/tourist-app`:

```nginx
server {
    listen 80;
    server_name routes.example.ru;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tourist-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d routes.example.ru
```

`client_max_body_size` нужен для загрузки фотографий: без него nginx отклонит файлы больше 1 МБ с ошибкой 413.

После настройки откройте `https://routes.example.ru`: должна появиться страница выбора города.

## 6. Карты 2GIS

Ключ задаётся переменной `MAPGL_KEY` в `.env`. Ключ должен давать доступ к MapGL JS API и Directions API (пешеходные маршруты). Ограничьте ключ доменом приложения в кабинете 2GIS: ключ встраивается в клиентский код и виден в браузере.

## 7. Подключение к боту MAX

1. В настройках бота на платформе MAX для партнёров укажите адрес мини-приложения: `https://routes.example.ru`.
2. Откройте бота в MAX и нажмите «Начать». Бот пришлёт приветствие с кнопкой «Открыть маршруты», которая ведёт на `https://max.ru/<BOT_NAME>?startapp=start`.
3. Ссылки «Поделиться» имеют вид `https://max.ru/<BOT_NAME>?startapp=route_<guid>` и открывают приложение сразу на маршруте.

Внутри MAX приложение получает id пользователя и подпись через MAX Bridge. В обычном браузере их нет, поэтому лайки и публикация там недоступны: это ожидаемое поведение, гостевого режима нет. Для проверки публикации вне MAX используйте `ALLOW_ANONYMOUS_ROUTES=true`.

## Обновление

```bash
git pull
docker compose up -d --build
```

База и загруженные картинки остаются в томах. Файл `server/application/modules/db/data.db` из репозитория используется только при самом первом запуске, дальше он на рабочую базу не влияет.

## Остановка и повторный запуск

```bash
docker compose stop        # остановить
docker compose start       # запустить снова
docker compose restart     # перезапустить
docker compose down        # остановить и удалить контейнеры, данные в томах сохраняются
docker compose up -d       # запустить после down
```

## Резервная копия

```bash
mkdir -p backup
docker compose cp server:/app/data/data.db backup/data.db
docker compose cp server:/app/public/uploads backup/uploads
```

Восстановление:

```bash
docker compose cp backup/data.db server:/app/data/data.db
docker compose cp backup/uploads/. server:/app/public/uploads
docker compose restart server
```

## Логи

```bash
docker compose logs -f server   # API
docker compose logs -f bot      # бот
docker compose logs -f client   # nginx
```

## Сброс базы

Чтобы вернуться к исходной базе из репозитория, остановите контейнеры и удалите том с базой. Все маршруты, созданные пользователями, и лайки будут удалены:

```bash
docker compose down
docker volume rm tourist-app_server-data
docker compose up -d
```

Имя тома начинается с имени папки проекта. Точное имя можно посмотреть командой `docker volume ls`.
