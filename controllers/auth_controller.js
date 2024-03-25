const User = require('../models/user_model');
const colors = require('colors');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Register user
// @route     POST /auth/register
// @access    Public

exports.register = async (req, res, next) => {
  const { email, password, confirm, name } = req.body;
  // Not DRY, this registrationError object is also in error.js; refactor
  let registrationError = {
    registration: {
      email: '',
      password: '',
      confirm: '',
      name: '',
    },
  };
  if (!email) registrationError.email = 'Required';
  if (!password) registrationError.password = 'Required';
  if (!confirm) registrationError.confirm = 'Required';
  if (!name) registrationError.name = 'Required';
  if (!email || !password || !confirm || !name) {
    return next(new ErrorResponse('All fields are required', 400, registrationError));
  }

  if (password !== confirm) {
    registrationError.confirm = 'Passwords must match';
    return next(new ErrorResponse('Passwords must match', 400, registrationError));
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc      Login user
// @route     POST /auth/login
// @access    Public

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      return next(
        new ErrorResponse('Please provide an email and password', 400)
      );
    }

    // Check for user, return their password
    const user = await User.findOne({ email }).select('+password');

    // Return error if user not in DB
    if (!user) {
      return next(new ErrorResponse('User Not Found', 401));
    }

    // Check for password match using mongoose method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Incorrect Password', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.forgot = async (req, res, next) => {
  res.status(200).json({ message: 'Contact mitchgruen.dev@gmail.com for assisstance.' });
}

// Get token from model, create cookie, send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
