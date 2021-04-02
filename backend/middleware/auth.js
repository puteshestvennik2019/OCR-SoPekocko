const getUserId = require("../utils/getUserIdFromToken");


module.exports = (req, res, next) => {
    try {
        const userId = getUserId(req.headers.authorization.split(' ')[1]);
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};