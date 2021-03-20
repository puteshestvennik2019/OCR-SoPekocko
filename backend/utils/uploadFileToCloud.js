const cloudinary = require('../utils/cloudinary');
const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

const uploadResponse = async (file) => {
    const response = await cloudinary.uploader.upload(
        parser.format(path.extname(file.originalname).toString(), file.buffer).content,
        { upload_preset: 'so_pekocko' });
    return response.url;
}

module.exports = uploadResponse;