module.exports = (answer) => (error, req, res, next) => answer.bad(res, error.status === 400 ? 69 : 9000);
