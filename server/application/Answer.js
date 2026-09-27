class Answer {
    errors = {
        11: { status: 401, message: "Ошибка авторизации" },
        23: { status: 500, message: "Ошибка добавления пользователя в БД" },
        25: { status: 404, message: "Маршрут не найден" },
        67: { status: 400, message: "Не переданы все необходимые параметры" },
        68: { status: 400, message: "Не удалось загрузить изображение" },
        69: { status: 400, message: "Некорректное тело запроса" },
        404: { status: 404, message: "Метод не найден" },
        9000: { status: 500, message: "Самая страшная ошибка" },
    }

    bad(res, code) {
        const { status, message } = this.errors[code];
        return res.status(status).send({
            result: "error",
            error: { code, message },
        });
    }

    good(data) {
        return {
            result: "ok",
            data,
        };
    }
}

module.exports = Answer;
