const express = require('express');
const router = express.Router();
const { uploadFiles } = require('../../middlewares/uploadfile');

// controller
const DashboardController = require('../../controllers/DashboardController');
const auth = require('../../middlewares/auth');
router.get('/', [auth], DashboardController.getInfo);

module.exports = router;
