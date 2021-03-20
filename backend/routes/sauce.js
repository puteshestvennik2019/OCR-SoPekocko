const Sauce = require('../models/sauce');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const uploadFromBufferToCloud = require('../utils/uploadFileToCloud');
const deleteFileFromCloud = require('../utils/deleteFileFromCloud');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Submit sauce
// POST /api/sauces
router.post('/', multer, async (req, res, next) => {
    let imageUrl = '';
    if (req.file) {
        imageUrl = await uploadFromBufferToCloud(req.file);
    }
    else {
        imageUrl = `${req.protocol}'://'${req.get('host')}/images/${req.file.filename}`;
    }

    const body = JSON.parse(req.body.sauce);

    const sauce = new Sauce({
        userId: body.userId,
        name: body.name,
        manufacturer: body.manufacturer,
        description: body.description,
        imageUrl: imageUrl,
        mainPepper: body.mainPepper,
        heat: body.heat,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
});

// Retrieve a single sauce
// GET /api/sauces/:id
router.get('/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
});

// Update a single sauce
// PUT /api/sauces/:id
router.put('/:id', (req, res, next) => {
    const body = req.body;

    const sauce = new Sauce({
        userId: body.userId,
        name: body.name,
        manufacturer: body.manufacturer,
        description: body.description,
        imageUrl: body.imageUrl,
        mainPepper: body.mainPepper,
        heat: body.heat,
        usersLiked: body.usersLiked,
        usersDisliked: body.usersDisliked
    })
    Sauce.updateOne({ _id: req.params.id }, sauce)  
        .then(() => {
            res.status(201).json({
                message: 'Sauce updated successfully' 
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
});

// Delete a single sauce
// DELETE /api/sauces/:id
router.delete('/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            Sauce.deleteOne({ _id: req.params.id })  
                .then(() => {
                    // TODO: handle error when deleting from cloudinary
                    deleteFileFromCloud(sauce.imageUrl);
                    res.status(201).json({
                        message: 'Sauce deleted successfully' 
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        error: error
                    });
                });

        })
        .catch((error) => {
            res.status(400).json({
                error: error
            })
        })
});

// Retrieve all sauces
// GET /api/sauces
router.get('/', (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
});

module.exports = router;