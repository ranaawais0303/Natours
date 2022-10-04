const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    // maxlength: [40, "A User's Name must have less or equal then 40 char"],
    // minlength: [6, "A User's Name must have more or equal then 6 char"],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        //this only works on CREATE and SAVE
        return el === this.password;
      },
      message: 'Confirm Password ({VALUE}) should be  Equal to  password',
    },
  },
});

//pre save
userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete the password confirm field
  this.passwordConfirm = undefined;
});

//User modal
const User = mongoose.model('User', userSchema);
module.exports = User;
