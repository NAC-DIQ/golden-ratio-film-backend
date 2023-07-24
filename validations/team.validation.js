const { check, validationResult } = require('express-validator');

const add = [
  check('name').notEmpty().withMessage('Name is required'),
  check('designation').notEmpty().withMessage('Designation is required'),
  check('content').notEmpty().withMessage('Content is required'),
  check('type').notEmpty().withMessage('Type is required'),

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
