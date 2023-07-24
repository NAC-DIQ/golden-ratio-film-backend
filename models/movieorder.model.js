const mongoose = require('mongoose');

const movieOrderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'upcoming',
    },
    movie: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Movies',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const MovieOrder = mongoose.model('MovieOrder', movieOrderSchema);
module.exports = MovieOrder;
