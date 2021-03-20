require('dotenv').config();
const mongoose = require('mongoose');
const mongobdURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yco1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(mongobdURI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

module.exports = { mongoose };