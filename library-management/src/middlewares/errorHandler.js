import e from 'express';
import {validationResult} from 'express-validator';

//Function to handle validation errors
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({
          status: 'error',
          message: 'Validation Error',
          errors: errors.array().map(error => ({ message: error.msg }))
      });
  }
  next();
};

//Function to handle generic errors
const genericErrorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    status: 'error', 
    message: 'Internal Server Error', 
    error: err.message 
  });
};

export { validationErrorHandler, genericErrorHandler };