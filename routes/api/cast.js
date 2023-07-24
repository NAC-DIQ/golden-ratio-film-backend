const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const CastController = require('../../controllers/CastController');
const auth = require('../../middlewares/auth');
// const { teamValidation } = require('../../validations');

// Routes
router.post('/', [auth, uploadFiles.single('image')], CastController.add);
router.get('/', [auth], CastController.getCast);
router.get('/:id', [auth], CastController.getById);
router.patch(
  '/:id',
  [auth, uploadFiles.single('image')],
  CastController.update
);
router.delete('/:id', [auth], CastController.archive);

module.exports = router;
