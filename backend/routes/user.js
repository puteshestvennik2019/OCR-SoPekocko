const User = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Signup
// POST /api/auth/signup
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => {
                    res.status(201).json({ message: 'User added successfully!' });
                })
                .catch((error) => {
                    if (error.message.split(':')[0] == "User validation failed") {
                        res.status(500).json({ error: new Error("Email already registered") });
                    }
                    else {
                        res.status(500).json({ error: error });
                    }
            });
        })
        .catch((error) => { 
            res.status(500).json({ error: error });
        });
});

// Login
// POST /api/auth/login
router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: new Error('User not found!') });
            }
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ error: new Error('Incorrect password!') });
                    }

                    const token = jwt.sign({ userId: user._id }, 
                                            'RANDOM_TOKEN_SECRET',
                                            { expiresIn: '24h' });
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error: error });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
});

module.exports = router;