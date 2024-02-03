const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // this is essential
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



// Encrypt with brcypt

// Sign JWT and return

// Match user entered password and hashed password in database

module.exports = mongoose.model('User', UserSchema);
