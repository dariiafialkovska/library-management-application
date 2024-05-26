import { body, param } from 'express-validator';


//Validation for creating a new user for name to be a string and not empty
export const createUserValidator = [
  body('name').isString().withMessage('User name must be a string').notEmpty().withMessage('Name is required'),
];
//Validation for user ID to be a numeric value
export const validateUserId = [
  param('id').isNumeric().withMessage('User ID must be a numeric value')
];
//Validation for book ID to be a numeric value
export const validateBookId = [
  param('id').isNumeric().withMessage('Book ID must be a numeric value')
];
//Validation for user ID to be a numeric value
export const validateByUserId = [
  param('userId').isNumeric().withMessage('User ID must be a numeric value')
];
//Validation for book ID to be a numeric value
export const validateByBookId = [
  param('bookId').isNumeric().withMessage('Book ID must be a numeric value')
];
//Validation for creating a new book for name to be a string and not empty
export const createBookValidator = [
  body('name').isString().withMessage('Book name must be a string').notEmpty().withMessage('Name is required'),
];
