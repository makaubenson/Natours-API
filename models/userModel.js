const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This only works on CREATE & SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

userSchema.pre('save', async function (next) {
  //only run this function if password was modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

//create instance method. - Method that is going to be available on all documents of certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//Create a user Model
const User = mongoose.model('User', userSchema);

module.exports = User;
