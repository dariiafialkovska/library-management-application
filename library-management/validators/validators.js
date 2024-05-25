const { body, param } = require('express-validator');

// User Validators
const createUserValidator = [
  body('name').isString().withMessage('User name must be a string').notEmpty().withMessage('Name is required'),
];

const validateUserId = [
  param('id').isNumeric().withMessage('User ID must be a numeric value')
];

// Book Validators
const createBookValidator = [
  body('name').isString().withMessage('Book name must be a string').notEmpty().withMessage('Name is required'),
];

const validateBookId = [
  param('id').isNumeric().withMessage('Book ID must be a numeric value')
];

module.exports = {
  createUserValidator,
  validateUserId,
  createBookValidator,
  validateBookId
};
