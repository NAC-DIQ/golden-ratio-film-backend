const { check, validationResult } = require('express-validator');

const add = [
  check('type').notEmpty().withMessage('Type is required'),
  check('title').notEmpty().withMessage('Title is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  add,
};
