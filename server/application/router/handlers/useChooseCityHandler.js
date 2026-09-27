module.exports = (mediator, answer) => {
    const { SECLECT_CITY } = mediator.getEventTypes();
    return (req, res) => {
        const city = req.params.city;

        if (!city){

            return answer.bad(res, 67);
        }
        return res.send(answer.good(true));
    };
};
