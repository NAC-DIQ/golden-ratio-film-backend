const { check, validationResult } = require('express-validator');

const signup = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password is required and must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const login = [
  check('email').isEmail().withMessage('Email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password is required and must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  signup,
  login,
};
