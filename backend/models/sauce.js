const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userID: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: false },
    heat: { type: Number, required: true },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false }
});

module.exports = mongoose.model('Sauce', sauceSchema);