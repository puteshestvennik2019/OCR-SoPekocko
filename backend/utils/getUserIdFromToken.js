const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUserId = (token) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.userId;
}

module.exports = getUserId;