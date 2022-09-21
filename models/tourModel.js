const mongoose = require('mongoose');

//Create database and collections//////

//Schema for our data
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
