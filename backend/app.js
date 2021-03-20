// const mongodbCredentials = require('./credentials/mongodb');
// const mongobdURI = `mongodb+srv://${mongodbCredentials.name}:${mongodbCredentials.password}@cluster0.yco1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const express = require('express');
require('./utils/mongoose');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// mongoose.connect(mongobdURI)
//     .then(() => {
//         console.log('Successfully connected to MongoDB Atlas!');
//     })
//     .catch((error) => {
//         console.log('Unable to connect to MongoDB Atlas!');
//         console.error(error);
//     });

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;