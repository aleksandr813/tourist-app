class Answer {
    errors = {
        11: "Ошибка авторизации",
        9000: "Самая страшная ошибка",
    }
    
    bad(error) {
        return this.errors[error];
    }

    good(data) {
        if (!data) {
            return this.error(9000);
        }
        return {
            result: "ok",
            data,
        };
    }
}