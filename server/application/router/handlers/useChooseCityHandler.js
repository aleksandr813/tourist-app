module.exports = (mediator, answer) => {
    const { SECLECT_CITY } = mediator.getEventTypes();
    return (req, res) => {
        const city = req.params.city;

        if (!city){

            return res.send(answer.bad(67));
        }
        return res.send(answer.good(true));
    };
};
