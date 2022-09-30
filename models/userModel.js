const mongoose = require('mongoose');
const validator = require('validator');

//create user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true, //ensure no same email will exist for different users
    lowercase: true, //transform email to lowercase
    validate: [validator.isEmail, 'Please provide a valid email'], //validate email
  },
  photo: {
    //will store path to photo in the file system
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8, //have min of 8 chars for a password
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

//Create a user Model
const User = mongoose.model('User', userSchema);

module.exports = User;
