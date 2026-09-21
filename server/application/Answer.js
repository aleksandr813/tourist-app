class Answer {
    errors = {
        11: "Ошибка авторизации",
        23: "Ошибка добавления пользователя в БД",
        67: "Не переданы все необходимые параметры",
        9000: "Самая страшная ошибка",
    }
    
    bad(error) {
        return this.errors[error];
    }

    good(data) {
        console.log(data);
        if (!data) {
            return this.error(9000);
        }
        return {
            result: "ok",
            data,
        };
    }
}

module.exports = Answer;