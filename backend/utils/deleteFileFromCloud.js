const cloudinary = require('../utils/cloudinary');

const deleteResponse = async (url) => {
    /* Q: Best practice to handle/save public ID? Potential problem - when saving files in a folder
    Possible approaches: 
        - Image object in DB
        - Method that adds the folder path when saving/deleting
    */
    try {
        const pubId = url.split('/').pop().split('.')[0];
        const response = await cloudinary.uploader.destroy(pubId, function(error,result) {
            // if (error)... potential problems: path, cloudinary server - how to handle?
        });
        return response;
    } catch (error) {
        return error;
    }
}

module.exports = deleteResponse;