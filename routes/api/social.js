const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const SocialController = require('../../controllers/SocialController');
const twitterController = require('../../controllers/twitterController');
const auth = require('../../middlewares/auth');

// Routes
router.post('/', [auth, uploadFiles.single('image')], SocialController.add);
router.get('/', SocialController.getAll);
router.get('/:id', [auth], SocialController.getById);
router.patch(
  '/:id',
  [auth, uploadFiles.single('image')],
  SocialController.update
);
router.delete('/:id', [auth], SocialController.archive);
router.get('/get/facebook', SocialController.getFacebook);
router.get('/get/twitter', twitterController.getUserTweets);
module.exports = router;
