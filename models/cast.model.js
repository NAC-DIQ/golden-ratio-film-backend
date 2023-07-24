const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
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

const Cast = mongoose.model('Cast', newsSchema);
module.exports = Cast;
