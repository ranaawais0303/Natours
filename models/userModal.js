const mongoose = require('mongoose');
const validator = require('validator');

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
    // validate: {
    //   validator: function (val) {
    //     //this only points to current doc on NEW document creation
    //     return val === this.password;
    //   },
    //   message: 'Confirm Password ({VALUE}) should be  Equal to  password',
    // },
  },
});

//User modal
const User = mongoose.model('User', userSchema);
module.exports = User;
