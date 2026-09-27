const INIT_DATA_HEADER = 'X-Max-Init-Data';

module.exports = (mediator, req, userId) => {
    const { GET_USER_ID } = mediator.getTriggerTypes();
    return mediator.get(GET_USER_ID, {
        initData: req.get(INIT_DATA_HEADER),
        userId: userId == null ? null : String(userId),
    });
};
