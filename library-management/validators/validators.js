const { body } = require('express-validator');

exports.createUserValidator = [
  body('name').isString().withMessage('User name must be a string').notEmpty().withMessage('Name is required'),
];

exports.createBookValidator = [
  body('name').isString().withMessage('Book name must be a string').notEmpty().withMessage('Name is required'),
];