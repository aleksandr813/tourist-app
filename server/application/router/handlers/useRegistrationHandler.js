module.exports = (exampleManager) => {
    return async (req, res) => {
        const username = req.params.username;
        const password = req.params.password;
        
        console.log(req);
    };
};
