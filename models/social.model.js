const { boolean } = require('joi');
const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'twitter',
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: '#',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'User',
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Social = mongoose.model('Social', socialSchema);
module.exports = Social;
