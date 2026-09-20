module.exports = (mediator, answer) => {
    const { GET_CITIES } = mediator.getTriggerTypes();
    return async (req, res) => {
       const cities = await mediator.get(GET_CITIES, {});
       return res.send(answer.good(cities));     
    };
};
