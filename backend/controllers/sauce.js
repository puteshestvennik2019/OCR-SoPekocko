const Sauce = require('../models/sauce');
const uploadFromBufferToCloud = require('../utils/uploadFileToCloud');
const deleteFileFromCloud = require('../utils/deleteFileFromCloud');
const helper = require('../utils/checkIfIncludes');
const getUserId = require('../utils/getUserIdFromToken');

exports.likeSauce = (req, res, next) => {
    if (req.body.like > 1 || req.body.like < -1) res.status(403);

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            sauce.usersLiked = helper.checkIfIncludes(req.body.userId, sauce.usersLiked, req.body.like !== 1);
            sauce.usersDisliked = helper.checkIfIncludes(req.body.userId, sauce.usersDisliked, req.body.like !== -1);
            sauce.likes = sauce.usersLiked.length;
            sauce.dislikes = sauce.usersDisliked.length;

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
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
}

exports.addSauce = async (req, res, next) => {
    const imageUrl = await uploadFromBufferToCloud(req.file);
    console.log(imageUrl)
    // if saved on the host
    // imageUrl = `${req.protocol}'://'${req.get('host')}/images/${req.file.filename}`;
    body = JSON.parse(req.body.sauce);

    const sauce = new Sauce({
        userId: body.userId,
        name: body.name,
        manufacturer: body.manufacturer,
        description: body.description,
        imageUrl: imageUrl,
        mainPepper: body.mainPepper,
        heat: body.heat
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
};

exports.getSingleSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
};

exports.updateSauce = async (req, res, next) => {
    let imageUrl = '';
    let body = {};
    if (req.file) {
        imageUrl = await uploadFromBufferToCloud(req.file);
        // if saved on the host
        // imageUrl = `${req.protocol}'://'${req.get('host')}/images/${req.file.filename}`;
        body = JSON.parse(req.body.sauce);
    }
    else {
        body = req.body;
    }

    const sauce = new Sauce({
        _id: req.params.id,
        userId: body.userId,
        name: body.name,
        manufacturer: body.manufacturer,
        description: body.description,
        imageUrl: imageUrl,
        mainPepper: body.mainPepper,
        heat: body.heat
    })

    Sauce.findOne({ _id: req.params.id })
        .then((oldSauce) => {
            sauce.likes = oldSauce.likes;
            sauce.dislikes = oldSauce.dislikes;
            sauce.usersLiked = oldSauce.usersLiked;
            sauce.usersDisliked = oldSauce.usersDisliked;

            // if new file is being uploaded, delete the old one
            if (sauce.imageUrl != '') {
                // TODO: handle error when deleting from cloudinary - exponential backoff
                deleteFileFromCloud(oldSauce.imageUrl);
            }
            else {
                sauce.imageUrl = oldSauce.imageUrl;
            }

            Sauce.updateOne({ _id: req.params.id }, sauce)  
                .then(() => {
                    res.status(201).json({
                        message: 'Sauce updated successfully' 
                    });
                })
                .catch((error) => {
                    // mongodb doesn't allow duplicate names for this schema (code 11000) and front end doesn't handle responses other than 200s
                    // if (error.code === 11000 ) {
                    //     res.status(299).json({
                    //         message: 'Sauce with this name already exists'
                    //     });
                    // } else {
                    res.status(500).json({
                        error: error
                    });
                    // }

                });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
};

exports.deleteSauce = (req, res, next) => {
    const userId = getUserId(req.headers.authorization.split(' ')[1]);

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != userId) {
                res.status(403);
            }

            // TODO: handle error when deleting from cloudinary - exponential backoff
            deleteFileFromCloud(sauce.imageUrl);
            Sauce.deleteOne({ _id: req.params.id })  
                .then(() => {
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
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
};