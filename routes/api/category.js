const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const CategoryController = require('../../controllers/CategoryController');
const auth = require('../../middlewares/auth');
const { categoryValidation } = require('../../validations');

// Routes
router.post('/', [auth, categoryValidation.add], CategoryController.add);
router.get('/', CategoryController.getAll);
router.get('/:id', [auth], CategoryController.getById);
router.patch('/:id', [auth], CategoryController.update);
router.delete('/:id', [auth], CategoryController.archive);

module.exports = router;
