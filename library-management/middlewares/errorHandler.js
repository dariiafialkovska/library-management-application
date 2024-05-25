const { validationResult } = require('express-validator');

const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Validation Error', 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      })) 
    });
  }
  next();
};

const genericErrorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    status: 'error', 
    message: 'Internal Server Error', 
    error: err.message 
  });
};

module.exports = { validationErrorHandler, genericErrorHandler };
