const express = require('express');
const router = express.Router();

// Controller
const AuthController = require('../../controllers/AuthController');
const { authValidation } = require('../../validations');

// router.get('/login', AuthController.Login);
router.post('/signup', authValidation.signup, AuthController.SignUp);
router.post('/login', authValidation.login, AuthController.Login);

module.exports = router;
