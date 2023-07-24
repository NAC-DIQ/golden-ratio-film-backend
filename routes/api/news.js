const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const NewsController = require('../../controllers/NewsController');
const auth = require('../../middlewares/auth');
const { newsValidation } = require('../../validations');

// Routes
router.post(
  '/',
  [auth, uploadFiles.single('image'), newsValidation.add],
  NewsController.add
);

router.get('/', NewsController.getAll);
router.get('/:id', NewsController.getById);
router.post('/update/:type', NewsController.updateOrders);
router.get('/update/:type', NewsController.getOrders);

router.patch(
  '/:id',
  [auth, uploadFiles.single('image'), newsValidation.add],
  NewsController.update
);
router.delete('/:id', [auth], NewsController.archive);

module.exports = router;
