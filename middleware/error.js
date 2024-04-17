const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  console.log('in the error handler, here is the error object');
  console.log(err.message)


  let message = err.message;
  let registrationError = {
    registration: {
      email: '',
      password: '',
      confirm: '',
      name: '',
    },
  };
  let error = { ...err };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    console.log('in the if cast error block');
    const message = `Resource not found with id of ${err.value}`;
    registrationError.registration.email = 'User not found';
    error = new ErrorResponse(message, 404, registrationError);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    console.log('in the if duplicate key block');
    const message = 'User already exists';
    registrationError.registration.email = 'User Already Exists';
    error = new ErrorResponse(message, 400, registrationError);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    console.log('In the validation error block');
    const message = Object.values(err.errors).map(
      (val) => val.properties.message
    );
    if (message.includes('Invalid email')) {
      registrationError.registration.email = 'Invalid Email';
    }
    if (message.includes('Invalid name')) {
      registrationError.registration.name = `That's your name?`;
    }
    error = new ErrorResponse(message, 400, registrationError);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    registration: error.details.registration,
  });
};

module.exports = errorHandler;
