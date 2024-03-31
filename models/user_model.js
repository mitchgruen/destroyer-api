const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    match: [/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/, `Invalid name`],
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
    // this is essential, so that passwords are not returned with every DB query
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Your task for today is to learn how all of the below works

// Encrypt with brcypt
// So this is going to be some mongoose middleware that automatically brcypts our passwords before they get sent to Atlas
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password and hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
