const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const ContactController = require('../../controllers/ContactController');
const auth = require('../../middlewares/auth');
// const { teamValidation } = require('../../validations');

// Routes
// router.post('/', [auth, uploadFiles.single('image')], CastController.add);
router.post('/', ContactController.add);

module.exports = router;
