const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8, //have min of 8 chars for a password
    select: false, // will automatically never show up in any output
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
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//password encryption

//between moment we receive data and saving it to DB - pre
userSchema.pre('save', async function (next) {
  //only run this function if password was modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  //bcrypt will salt then hash password.
  //hashing means adding a random string to the password so that similar passwords don't match
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm field not to be persisted in DB
  this.passwordConfirm = undefined;

  next();
});

//create Instance Method. - Method that is going to be available on all DOCUMENTS of certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //candidatePassword is the original password - NOT HASHED
  // userPassword is the hashed password
  return await bcrypt.compare(candidatePassword, userPassword); //returns true or false
};

//instance method
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  //false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//Create a user Model
const User = mongoose.model('User', userSchema);

module.exports = User;
