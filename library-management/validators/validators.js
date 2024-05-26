const { param,body } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/Book');
// User Validators
exports.createUserValidator = [
  body('name').isString().withMessage('User name must be a string').notEmpty().withMessage('Name is required'),
];



exports.validateUserId = [
  param('id').isNumeric().withMessage('User ID must be a numeric value')
];

exports.validateBookId = [
  param('id').isNumeric().withMessage('Book ID must be a numeric value')
];



exports.validateByUserId = [
  param('userId').isNumeric().withMessage('User ID must be a numeric value')
];

exports.validateByBookId = [
  param('bookId').isNumeric().withMessage('Book ID must be a numeric value')
];

// Book Validators
exports.createBookValidator = [
  body('name').isString().withMessage('Book name must be a string').notEmpty().withMessage('Name is required'),
];

