const cloudinary = require('../utils/cloudinary');

const deleteResponse = async (url) => {
    try {
        const pubId = url.split('/').pop().split('.')[0];
        const response = await cloudinary.uploader.destroy(pubId);
        return response;
    } catch (error) {
        return error;
    }
}

module.exports = deleteResponse;