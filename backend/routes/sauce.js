const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.post('/', auth, multer, sauceCtrl.addSauce);
router.get('/:id', auth, sauceCtrl.getSingleSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;