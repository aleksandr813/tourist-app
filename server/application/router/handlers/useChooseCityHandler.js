module.exports = (mediator, answer) => {
    const { SECLECT_CITY } = mediator.getEventTypes();
    return (req, res) => {
        const city = req.params.city;
        if (!city){
            res.send(answer.bad(67));
        }
    };
};
